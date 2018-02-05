import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, map } from 'rxjs/operators';
import { GridOptions } from 'ag-grid';
import { Observable } from 'rxjs/Observable';

import { IActionGridDialogData, ICloseAction } from './action-grid.interface';
import { IAGridAction, IAGridRequestParams, IAGridSelected, IAGridColumn } from '../grid2/grid2.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IGridColumn, IContextMenuItem } from '../grid/grid.interface';
import { IMetadataSortedActions, IMetadataAction, IMetadataActionPermissions } from '@app/core/metadata/metadata.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridFilterComponent } from './filter/action-grid-filter.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';
import { GridComponent } from '../../components/grid/grid.component';

import { DialogFunctions } from '../../../core/dialog';
import { FilterObject } from '../grid2/filter/grid-filter';
import { ValueBag } from '@app/core/value-bag/value-bag';

@Component({
  selector: 'app-action-grid',
  templateUrl: 'action-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActionGridComponent<T> extends DialogFunctions implements OnInit {

  @Input() columnIds: string[];
  @Input() fullHeight = false;
  @Input() metadataKey: string;
  @Input() ngClass: string;
  @Input() persistenceKey: string;
  @Input() rowCount: number;
  @Input() rowIdKey: string;
  @Input() rows: T[] = [];
  @Input() columnTranslationKey: string;
  @Input() columns: IGridColumn[];
  @Input() contextMenuOptions: IContextMenuItem[];
  @Input() styles: CSSStyleDeclaration;

  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<IAGridSelected>();
  @Output() action = new EventEmitter<IActionGridDialogData>();

  @ViewChild(ActionGridFilterComponent) filter: ActionGridFilterComponent;
  @ViewChild('grid') grid: GridComponent | Grid2Component;

  private _columns: IAGridColumn[];
  private _initialized = false;

  private actions$ = new BehaviorSubject<any[]>(null);
  private actionsWithPermissions$: Observable<IMetadataSortedActions>;
  private actionsWithPermissionsForAll$: Observable<IMetadataAction[]>;
  private actionsWithPermissionsForSelected$: Observable<IMetadataAction[]>;

  dialog: string;
  dialogData: IActionGridDialogData;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private gridService: GridService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {

    if (this.metadataKey) {
      this.gridService.getMetadata(this.metadataKey, {})
        .pipe(first())
        .subscribe(({ actions, columns }) => {
          this.actions$.next(actions);
          this._columns = [ ...columns ];
          this._initialized = true;
          this.cdRef.markForCheck();
        });
    }

     this.actionsWithPermissions$ = combineLatest(
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

      this.actionsWithPermissionsForAll$ = this.actionsWithPermissions$.map(sortedActions => sortedActions.all);
      this.actionsWithPermissionsForSelected$ = this.actionsWithPermissions$.map(sortedActions => sortedActions.selected);
  }

  get selection(): T[] {
    return this.grid.selected as T[];
  }

  get isUsingAGGrid(): boolean {
    return !!this.metadataKey;
  }

  isAttrChangeDictionaryDlg(): boolean {
    return [
      'changeRegionAttr',
      'changeDict1Attr',
      'changeDict2Attr',
      'changeDict3Attr',
      'changeDict4Attr',
      'changeCreditTypeAttr',
      'changeBranchAttr'
    ].includes(this.dialog);
  }

  getAddOptions(name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    const found = this.dialogData.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(name: string, index: number): number|string {
    const options = this.getAddOptions(name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  getSelectionParam(key: number): any[] {
    return this.dialogData.selection[key];
  }

  getConfiguredParams(paramName: string): any[] {
    if (!(this.grid as Grid2Component).actions) {
      // NOTE: this function is not available on grid1
      return;
    }

    const idNames = (this.grid as  Grid2Component).actions
      .filter(a => a.action === paramName)[0].params;

    const { selection } = this.dialogData;
    const container = Array.from(Array(selection[0].length), () => ({}));

    return idNames.reduce((acc, idName, idNum) => {
      selection[idNum].forEach((current, ind) => {
        acc[ind][idName] = current;
      });
      return acc;
    }, container);
  }

  getDialogParam(key: number): number | string {
    return this.dialogData.params[key];
  }

  getFilters(): FilterObject {
    return this.grid instanceof Grid2Component
      ? this.getGridFilters()
      : null;
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid instanceof Grid2Component
      ? this.grid.getRequestParams()
      : null;
  }

  getFiltersForm(): FormGroup {
    return this.filter && this.filter.form && this.filter.form.form;
  }

  onAction(gridAction: IAGridAction): void {
    const { metadataAction, params } = gridAction;
    this.dialog = metadataAction.action;
    this.dialogData = {
      addOptions: metadataAction.addOptions,
      params: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: params.node.data[param]
      }), {}),
      selection: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection.map(item => item[param])
      }), {}),
    };
    this.cdRef.markForCheck();
  }

  onSimpleGridAction(metadataAction: any): void {
    this.dialog = metadataAction.action;
    this.dialogData = {
      addOptions: metadataAction.addOptions,
      params: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection[0][param]
      }), {}),
      selection: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection.map(item => item[param])
      }), {}),
    };
    this.cdRef.markForCheck();
  }

  onCloseAction(action: ICloseAction = {}): void {
    if (action.refresh) {
      this.onRequest();
    }
    if (action.deselectAll) {
      if (this.isUsingAGGrid) {
        (this.grid as Grid2Component).deselectAll();
      } else {
        (this.grid as GridComponent).clearSelection();
      }
    }
    this.onCloseDialog();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.dblClick.emit(row);
  }

  onSelect(selected: number[]): void {
    this.select.emit(selected);
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get selected(): T[] {
    return this.grid && this.grid.selected || [] as any[];
  }

  get gridActions$(): Observable<IMetadataSortedActions> {
    return this.actionsWithPermissions$;
  }

  get gridActionsForSelected$(): Observable<IMetadataAction[]> {
    return this.actionsWithPermissionsForSelected$;
  }

  get gridActionsForAll$(): Observable<IMetadataAction[]> {
    return this.actionsWithPermissionsForAll$;
  }

  get gridOptions(): GridOptions {
    return this.grid && this.gridOptions;
  }

  get columnsDef(): IAGridColumn[] {
    return this._columns || [];
  }

  private getGridFilters(): FilterObject {
    const filters = (this.grid as Grid2Component).getFilters();
    if (this.filter) {
      filters.addFilter(this.filter.filters);
    }
    return filters;
  }

  private filterActions(actions: IMetadataAction[]): IMetadataSortedActions  {
    return actions.reduce((acc, action: IMetadataAction) => {
      const arr = action.applyTo && action.applyTo.all ? acc.all : acc.selected;
      arr.push(action);
      return acc;
    }, { all: [], selected: [] });
  }

  private addPermissions(actions: IMetadataAction[], constants: ValueBag, permissions: ValueBag,
      entityPerms: IEntityAttributes): IMetadataSortedActions {

    const actionPermissions = this.buildPermissions(actions, constants, permissions, entityPerms);

    return this.filterActions(this.attachPermissions(actions, actionPermissions));
  }

  private attachPermissions(actions: IMetadataAction[], actionPermissions: IMetadataActionPermissions): IMetadataAction[] {
    return actions.map(action => ({
      ...action,
      enabled: actionPermissions[action.action],
      children: action.children ? this.attachPermissions(action.children, actionPermissions) : undefined
    }));
  }

  private buildPermissions(actions: IMetadataAction[], constants: ValueBag,
    permissions: ValueBag, entityPerms: IEntityAttributes): IMetadataActionPermissions {
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
          && permissions.contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole));
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
          && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole));
      },
      debtOutsourcingSend: selection => selection.length && permissions.has('DEBT_OUTSOURCING_SEND'),
      debtOutsourcingExclude: selection => selection.length && permissions.has('DEBT_OUTSOURCING_EXCLUDE'),
      debtOutsourcingReturn: selection => selection.length && permissions.has('DEBT_OUTSOURCING_RETURN'),
    };
  }

}
