import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';

// import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import {
  IAGridAction,
  IAGridColumn,
  IAGridRequestParams,
  IAGridSelected,
  IAGridSortModel,
} from '../grid2/grid2.interface';
import { IEntityAttributes } from '../../../core/entity/attributes/entity-attributes.interface';

import { EntityAttributesService } from '../../../core/entity/attributes/entity-attributes.service';
import { GridService } from '../grid/grid.service';
import { UserConstantsService } from '../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { Grid2Component } from '../grid2/grid2.component';
import { MetadataFilterComponent } from '../metadata-grid/filter/metadata-filter.component';

import { FilterObject } from '../grid2/filter/grid-filter';
import { ValueBag } from '../../../core/value-bag/value-bag';

@Component({
  selector: 'app-metadata-grid',
  templateUrl: 'metadata-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataGridComponent<T> implements OnInit {
  @Input() columnIds: string[];
  @Input() fullHeight = false;
  @Input() metadataKey: string;
  @Input() ngClass: string;
  @Input() persistenceKey: string;
  @Input() rowCount: number;
  @Input() rowIdKey: string;
  @Input() rows: T[] = [];

  @Output() action = new EventEmitter<IAGridAction>();
  @Output() onDblClick = new EventEmitter<T>();
  @Output() onFilter = new EventEmitter<FilterObject>();
  @Output() onPage = new EventEmitter<number>();
  @Output() onPageSize = new EventEmitter<number>();
  @Output() onSort = new EventEmitter<IAGridSortModel[]>();
  @Output() onSelect = new EventEmitter<IAGridSelected>();

  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild(MetadataFilterComponent) filter: MetadataFilterComponent;

  private _columns: IAGridColumn[];
  private _initialized = false;

  private actions$ = new BehaviorSubject<any[]>(null);

  private actionsWithPermissions$ = combineLatest(
    this.actions$.pipe(filter(Boolean)),
    this.userConstantsService.bag(),
    this.userPermissionsService.bag(),
    this.entityAttributesService.getDictValueAttributes()
  )
  .pipe(
    map(([ actions, constants, permissions, entityPermissions ]) => {
      return this.addPermissions(actions, constants, permissions, entityPermissions);
    })
  );

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private gridService: GridService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridService.getMetadata(this.metadataKey, {})
      .pipe(first())
      .subscribe(({ actions, columns }) => {
        this.actions$.next(actions);
        this._columns = [ ...columns ];
        this._initialized = true;
        this.cdRef.markForCheck();
      });
  }

  get selected(): T[] {
    return this.grid && this.grid.selected || [] as any[];
  }

  get gridActions$(): Observable<any[]> {
    return this.actionsWithPermissions$;
  }

  get gridOptions(): GridOptions {
    return this.grid && this.grid.gridOptions;
  }

  get columns(): IAGridColumn[] {
    return this._columns || [];
  }

  get initialized(): boolean {
    return this._initialized;
  }

  onAction(event: any): void {
    this.action.emit(event);
  }

  onDblClickHandler(event: any): void {
    this.onDblClick.emit(event);
  }

  onFilterHandler(): void {
    this.onFilter.emit();
  }

  onPageHandler(): void {
    this.onPage.emit();
  }

  onPageSizeHandler(): void {
    this.onPageSize.emit();
  }

  onSortHandler(): void {
    this.onSort.emit();
  }

  onSelectHandler(event: any): void {
    this.onSelect.emit(event);
  }

  getFilters(): FilterObject {
    const filters = this.grid.getFilters();
    if (this.filter) {
      filters.addFilter(this.filter.filters);
    }
    return filters;
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid.getRequestParams();
  }

  private addPermissions(mockActions: any[], constants: ValueBag, permissions: ValueBag, entityPerms: IEntityAttributes): any[] {
    const actionPermissions = this.buildPermissions(mockActions, constants, permissions, entityPerms);
    return this.attachPermissions(mockActions, actionPermissions);
  }

  private attachPermissions(mockActions: any[], actionPermissions: any): any[] {
    return mockActions.map(action => ({
      ...action,
      enabled: actionPermissions[action.action],
      children: action.children ? this.attachPermissions(action.children, actionPermissions) : undefined
    }));
  }

  private buildPermissions(actions: any, constants: ValueBag, permissions: ValueBag, entityPerms: IEntityAttributes)
    : { [key: string]: (...args: any[]) => any } {
    return {
      addVisit: selection => selection.length && permissions.has('ADDRESS_VISIT_ADD'),
      cancelVisit: selection => selection.length && permissions.has('VISIT_CANCEL'),
      changePortfolioAttr: selection => selection.length && permissions.has('DEBT_PORTFOLIO_EDIT'),
      changeRegionAttr: selection => selection.length && permissions.has('DEBT_EDIT'),
      changeDict1Attr: selection => selection.length && permissions.notEmpty('DEBT_DICT1_EDIT_LIST') &&
        entityPerms[EntityAttributesService.DICT_VALUE_1].isUsed,
      changeDict2Attr: selection => selection.length && permissions.notEmpty('DEBT_DICT2_EDIT_LIST') &&
      entityPerms[EntityAttributesService.DICT_VALUE_2].isUsed,
      changeDict3Attr: selection => selection.length && permissions.notEmpty('DEBT_DICT3_EDIT_LIST') &&
      entityPerms[EntityAttributesService.DICT_VALUE_3].isUsed,
      changeDict4Attr: selection => selection.length && permissions.notEmpty('DEBT_DICT4_EDIT_LIST') &&
      entityPerms[EntityAttributesService.DICT_VALUE_4].isUsed,
      changeCreditTypeAttr: selection => selection.length && permissions.has('DEBT_EDIT'),
      changeBranchAttr: selection => selection.length && permissions.has('DEBT_EDIT'),
      changeTimezoneAttr: selection => selection.length && permissions.has('DEBT_EDIT'),
      confirmPaymentsOperator: selection => selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      confirmPromise: selection => selection.length && permissions.has('PROMISE_CONFIRM'),
      debtClearResponsible: selection => selection.length && permissions.has('DEBT_RESPONSIBLE_CLEAR'),
      debtNextCallDate: selection => selection.length && permissions.has('DEBT_NEXT_CALL_DATE_SET'),
      debtSetResponsible: selection => selection.length && permissions.hasOneOf([
        'DEBT_RESPONSIBLE_SET',
        'DEBT_RESPONSIBLE_RESET',
      ]),
      deletePromise: selection => selection.length && permissions.hasOneOf([ 'PROMISE_DELETE', 'PROMISE_CONFIRM' ]),
      deleteSMS: selection => selection.length && permissions.notEmpty('SMS_DELETE_STATUS_LIST'),
      emailCreate: selection => {
        const action = actions.find(a => a.action === 'emailCreate');
        const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
        return selection.length
          && constants.has('Email.Use')
          && permissions.contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', personRole);
      },
      // TODO(d.maltsev, i.kibisov): pass entityTypeId
      objectAddToGroup: selection => selection.length && permissions.contains('ADD_TO_GROUP_ENTITY_LIST', 19),
      openUserDetail: (selection, row) => row && row.userId && permissions.has('OPERATOR_DETAIL_VIEW'),
      paymentsCancel: selection => selection.length && permissions.has('PAYMENT_CANCEL'),
      paymentsConfirm: selection => selection.length && permissions.has('PAYMENT_CONFIRM'),
      prepareVisit: selection => selection.length && permissions.has('VISIT_PREPARE'),
      rejectPaymentsOperator: selection => selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      showContactHistory: (selection, row) => row && row.userId && permissions.has('CONTACT_LOG_VIEW'),
      smsCreate: selection => {
        const action = actions.find(a => a.action === 'smsCreate');
        const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
        return selection.length
          && constants.has('SMS.Use')
          && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', personRole);
      },
      debtOutsourcingSend: selection => selection.length && permissions.has('DEBT_OUTSOURCING_SEND'),
      debtOutsourcingExclude: selection => selection.length && permissions.has('DEBT_OUTSOURCING_EXCLUDE'),
      debtOutsourcingReturn: selection => selection.length && permissions.has('DEBT_OUTSOURCING_RETURN'),
    };
  }
}
