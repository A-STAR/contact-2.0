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
  @Input() metadataKey: string;
  @Input() ngClass: string;
  @Input() persistenceKey: string;
  @Input() rowIdKey: string;
  @Input() rows: T[] = [];
  @Input() rowCount: number;

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
  )
  .pipe(
    map(([ actions, constants, permissions ]) => {
      // TODO(d.maltsev): remove mock actions
      const mockActions = [
        ...actions,
        {
          action: 'smsCreate',
          params: [ 'debtId', 'personId' ],
          addOptions: [
            {
              name: 'personRole',
              value: [ 1 ],
            },
          ]
        },
        {
          action: 'emailCreate',
          params: [ 'debtId', 'personId' ],
          addOptions: [
            {
              name: 'personRole',
              value: [ 1 ],
            },
          ]
        },
        {
          action: 'debtChangeAttribute',
          params: [ 'debtId', 'personId' ],
          children: [
            { action: 'changePortfolioAttr', params: ['portfolioId'] },
            { action: 'changeRegionAttr', params: ['regionCode'] },
            { action: 'changeDict1Attr', params: ['dict1Code'] },
            { action: 'changeDict2Attr', params: ['dict2Code'] },
            { action: 'changeDict3Attr', params: ['dict3Code'] },
            { action: 'changeDict4Attr', params: ['dict4Code'] },
            { action: 'changeCreditTypeAttr', params: ['creditTypeCode'] },
            { action: 'changeBranchAttr', params: ['branchCode'] },
            { action: 'changeTimezoneAttr', params: ['timeZoneId'] },
          ]
        },
      ];
      const actionPermissions = this.buildPermissions(mockActions, constants, permissions);
      return mockActions.map(action => ({
        ...action,
        enabled: actionPermissions[action.action],
      }));
  }));

  constructor(
    private cdRef: ChangeDetectorRef,
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

  private buildPermissions(actions: any, constants: ValueBag, permissions: ValueBag): any {
    return {
      cancelVisit: selection => selection.length && permissions.has('VISIT_CANCEL'),
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
      paymentsCancel: selection => selection.length && permissions.has('PAYMENT_CANCEL'),
      paymentsConfirm: selection => selection.length && permissions.has('PAYMENT_CONFIRM'),
      prepareVisit: selection => selection.length && permissions.has('VISIT_PREPARE'),
      rejectPaymentsOperator: selection => selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      showContactHistory: selection => selection.length && permissions.has('CONTACT_LOG_VIEW'),
      smsCreate: selection => {
        const action = actions.find(a => a.action === 'smsCreate');
        const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
        return selection.length
          && constants.has('SMS.Use')
          && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', personRole);
      },
      // TODO(m.bobryshev): mock
      visitAdd: selection => selection.length, // && permissions.has('VISIT_ADD'),
    };
  }
}
