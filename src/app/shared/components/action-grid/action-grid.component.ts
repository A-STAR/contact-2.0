import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, map } from 'rxjs/operators';
import { GridOptions } from 'ag-grid';
import { Observable } from 'rxjs/Observable';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';

import {
  ICloseAction,
  IGridAction,
  IActionGridAction,
} from './action-grid.interface';
import {
  IAGridAction,
  IAGridRequestParams,
  IAGridSelected,
  IAGridColumn,
  IAGridExportableColumn,
} from '../grid2/grid2.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IGridColumn, IContextMenuItem } from '../grid/grid.interface';
import {
  IMetadataAction,
  IMetadataActionPermissions,
  MetadataActionType,
  IMetadataTitlebar,
} from '@app/core/metadata/metadata.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ActionGridFilterService } from './filter/action-grid-filter.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridFilterComponent } from './filter/action-grid-filter.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';
import { GridComponent } from '../../components/grid/grid.component';
import { TitlebarComponent } from '@app/shared/components/titlebar/titlebar.component';

import { DialogFunctions } from '../../../core/dialog';
import { FilterObject } from '../grid2/filter/grid-filter';
import { ValueBag } from '@app/core/value-bag/value-bag';

@Component({
  selector: 'app-action-grid',
  templateUrl: 'action-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  providers: [ ActionGridFilterService ]
})
export class ActionGridComponent<T> extends DialogFunctions implements OnInit {

  @Input() columnIds: string[];
  @Input() fullHeight = false;
  @Input() metadataKey: string;
  @Input() ngClass: string;
  @Input() persistenceKey: string;
  /**
   * Will be deprecated
   * @deprecated
   */
  @Input() permissionKey: string;
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

  @ViewChild(ActionGridFilterComponent) filter: ActionGridFilterComponent;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;
  @ViewChild(TitlebarComponent) gridBar: TitlebarComponent;
  @ViewChild('grid') grid: GridComponent | Grid2Component;

  private _columns: IAGridColumn[];
  private _initialized = false;

  private actions$ = new BehaviorSubject<any[]>(null);
  private titlebarConfig$ = new BehaviorSubject<IMetadataTitlebar>(null);
  private defaultActionName: string;
  private defaultAction: IMetadataAction;

  dialog: string;
  dialogData: IGridAction;
  gridActions$: Observable<IMetadataAction[]>;
  titlebar$: Observable<ITitlebar>;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {

    if (this.metadataKey) {
      this.getGridPermission(this.permissionKey)
        .switchMap(isAllowed => {
          if (isAllowed) {
            return this.gridService.getMetadata(this.metadataKey, {});
          }
          this.notificationsService.permissionError().entity(`entities.${this.metadataKey}.gen.plural`).dispatch();
          return never();
        })
        .pipe(first())
        .subscribe(({ actions, columns, titlebar, defaultAction }) => {
          this.actions$.next(actions);
          this.defaultActionName = defaultAction;
          this.titlebarConfig$.next(titlebar);
          this._columns = [ ...columns ];
          this._initialized = true;
          this.cdRef.markForCheck();
        });
    }

    this.gridActions$ = this.getGridActions();
    this.titlebar$ = this.getGridTitlebar();
  }

  getGridPermission(permissionKey?: string): Observable<boolean> {
      return permissionKey ? this.userPermissionsService.has(permissionKey) : of(true);
  }

  getGridActions(): Observable<IMetadataAction[]> {
    return combineLatest(
        this.actions$.pipe(filter(Boolean)),
        this.userConstantsService.bag(),
        this.userPermissionsService.bag(),
        this.entityAttributesService.getDictValueAttributes()
      )
      .pipe(map(([actions, constants, permissions, entityPermissions]) => {
        const actionsWithPermissions = this.addPermissions(actions, constants, permissions, entityPermissions);
        this.defaultAction = this.getDefaultAction(actionsWithPermissions);
        return actionsWithPermissions;
      }));
  }

  getGridTitlebar(): Observable<ITitlebar> {
    return combineLatest(
      this.titlebarConfig$.pipe(filter(Boolean)),
      this.actionGridFilterService.hasFilter$.pipe(filter(Boolean)),
    )
    .pipe(map(([config, hasFilters]) => {
      return hasFilters ? this.buildTitlebar(config) : null;
    }));
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
    const action = {
      metadataAction: gridAction.metadataAction,
      selection: gridAction.selection.node.data
    };
    this.dialog = action.metadataAction.action;
    this.dialogData = this.setDialogData(action);
    this.cdRef.markForCheck();
  }

  onSimpleGridAction(metadataAction: IMetadataAction): void {
    alert(`Action ${metadataAction.action} is deprecated for simple grid!`);
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
    if (this.defaultAction) {
      const action: IActionGridAction = {
        selection: row,
        metadataAction: {
          ...this.defaultAction,
          type: MetadataActionType.SINGLE
        }
      };
      this.dialog = action.metadataAction.action;
      this.dialogData = this.setDialogData(action);
      this.cdRef.markForCheck();
    }
  }

  onSimpleGridDblClick(row: T): void {
    this.dblClick.emit(row);
  }

  onSelect(selected: number[]): void {
    this.select.emit(selected);
  }

  getExportableColumns(): IAGridExportableColumn[] {
    return this.grid instanceof Grid2Component
      ? this.grid.getExportableColumns()
      : null;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get selected(): T[] {
    return this.grid && this.grid.selected || [] as any[];
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

  private setDialogData(action: IActionGridAction): IGridAction {
    return {
      addOptions: action.metadataAction.addOptions,
      payload: this.actionGridFilterService.getPayload(action, {
        selection: this.selection,
        metadataKey: this.metadataKey,
        filters: this.getFilters()
      }),
      selection: this.actionGridFilterService.getGridSelection(action, this.selection)
    };
  }

  private addPermissions(actions: IMetadataAction[], constants: ValueBag, permissions: ValueBag,
      entityPerms: IEntityAttributes): IMetadataAction[] {

    const actionPermissions = this.buildPermissions(actions, constants, permissions, entityPerms);

    return this.attachPermissions(actions, actionPermissions);
  }
  // TODO(i.lobanov): rewrite this in functional way
  private getDefaultAction(actions: IMetadataAction[]): IMetadataAction {
    let found: IMetadataAction;
    for (const action of actions) {
      if (action.action === this.defaultActionName) {
        return action;
      } else if (action.children) {
        found = this.getDefaultAction(action.children);
        if (found) {
          return found;
        }
      }
    }
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
      addVisit: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('ADDRESS_VISIT_ADD') : selection.length && permissions.has('ADDRESS_VISIT_ADD'),
      cancelVisit: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('VISIT_CANCEL') : selection.length && permissions.has('VISIT_CANCEL'),
      changePortfolioAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_PORTFOLIO_EDIT') : selection.length && permissions.has('DEBT_PORTFOLIO_EDIT'),
      changeRegionAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_EDIT') : selection.length && permissions.has('DEBT_EDIT'),
      changeDict1Attr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.notEmpty('DEBT_DICT1_EDIT_LIST') && entityPerms[EntityAttributesService.DICT_VALUE_1].isUsed :
        selection.length && permissions.notEmpty('DEBT_DICT1_EDIT_LIST')
          && entityPerms[EntityAttributesService.DICT_VALUE_1].isUsed,
      changeDict2Attr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.notEmpty('DEBT_DICT2_EDIT_LIST') && entityPerms[EntityAttributesService.DICT_VALUE_2].isUsed :
        selection.length
          && permissions.notEmpty('DEBT_DICT2_EDIT_LIST') && entityPerms[EntityAttributesService.DICT_VALUE_2].isUsed,
      changeDict3Attr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.notEmpty('DEBT_DICT3_EDIT_LIST') && entityPerms[EntityAttributesService.DICT_VALUE_3].isUsed :
        selection.length && permissions.notEmpty('DEBT_DICT3_EDIT_LIST')
          && entityPerms[EntityAttributesService.DICT_VALUE_3].isUsed,
      changeDict4Attr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.notEmpty('DEBT_DICT4_EDIT_LIST') && entityPerms[EntityAttributesService.DICT_VALUE_4].isUsed :
        selection.length && permissions.notEmpty('DEBT_DICT4_EDIT_LIST')
          && entityPerms[EntityAttributesService.DICT_VALUE_4].isUsed,
      changeCreditTypeAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_EDIT') : selection.length && permissions.has('DEBT_EDIT'),
      changeBranchAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_EDIT') : selection.length && permissions.has('DEBT_EDIT'),
      changeTimezoneAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_EDIT') : selection.length && permissions.has('DEBT_EDIT'),
      confirmPaymentsOperator: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PAYMENTS_OPERATOR_CHANGE') : selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      confirmPromise: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PROMISE_CONFIRM') : selection.length && permissions.has('PROMISE_CONFIRM'),
      debtClearResponsible: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_RESPONSIBLE_CLEAR') : selection.length && permissions.has('DEBT_RESPONSIBLE_CLEAR'),
      debtNextCallDate: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_NEXT_CALL_DATE_SET') : selection.length && permissions.has('DEBT_NEXT_CALL_DATE_SET'),
      debtSetResponsible: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.hasOneOf(['DEBT_RESPONSIBLE_SET', 'DEBT_RESPONSIBLE_RESET', ]) : selection.length
          && permissions.hasOneOf(['DEBT_RESPONSIBLE_SET', 'DEBT_RESPONSIBLE_RESET', ]),
      deletePromise: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.hasOneOf([ 'PROMISE_DELETE', 'PROMISE_CONFIRM' ]) : selection.length
          && permissions.hasOneOf([ 'PROMISE_DELETE', 'PROMISE_CONFIRM' ]),
      deleteSMS: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.notEmpty('SMS_DELETE_STATUS_LIST') : selection.length && permissions.notEmpty('SMS_DELETE_STATUS_LIST'),
      emailCreate: (actionType: MetadataActionType, selection) => {
        const action = actions.find(a => a.action === 'emailCreate');
        const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
        return actionType === MetadataActionType.ALL ? constants.has('Email.Use')
          && permissions.contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole)) :
          selection.length && constants.has('Email.Use')
            && permissions.contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole));
      },
      // TODO(d.maltsev, i.kibisov): pass entityTypeId
      objectAddToGroup: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.contains('ADD_TO_GROUP_ENTITY_LIST', 19) : selection.length
          && permissions.contains('ADD_TO_GROUP_ENTITY_LIST', 19),
      openUserDetail: (actionType: MetadataActionType, selection, row) => row && row.userId
        && permissions.has('OPERATOR_DETAIL_VIEW'),
      paymentsCancel: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PAYMENT_CANCEL') : selection.length && permissions.has('PAYMENT_CANCEL'),
      paymentsConfirm: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PAYMENT_CONFIRM') : selection.length && permissions.has('PAYMENT_CONFIRM'),
      prepareVisit: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('VISIT_PREPARE') : selection.length && permissions.has('VISIT_PREPARE'),
      rejectPaymentsOperator: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
      permissions.has('PAYMENTS_OPERATOR_CHANGE') : selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      showContactHistory: (actionType: MetadataActionType, selection, row) => row && row.personId
        && permissions.has('CONTACT_LOG_VIEW'),
      smsCreate: (actionType: MetadataActionType, selection) => {
        const action = actions.find(a => a.action === 'smsCreate');
        const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
        return actionType === MetadataActionType.ALL ? constants.has('SMS.Use')
          && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole)) :
          selection.length && constants.has('SMS.Use')
            && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', Number(personRole));
      },
      debtOutsourcingSend: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_OUTSOURCING_SEND') : selection.length && permissions.has('DEBT_OUTSOURCING_SEND'),
      debtOutsourcingExclude: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_OUTSOURCING_EXCLUDE') : selection.length && permissions.has('DEBT_OUTSOURCING_EXCLUDE'),
      debtOutsourcingReturn: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('DEBT_OUTSOURCING_RETURN') : selection.length && permissions.has('DEBT_OUTSOURCING_RETURN'),
    };
  }

  private buildTitlebar(config: IMetadataTitlebar): ITitlebar {
    // TODO(i.lobanov): mock, remove when titlebar added in config
    const titlebarItems = {
      refresh: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.onRequest(),
        enabled: permissions ? this.userPermissionsService.hasAll(permissions) : of(true)
      }),
      search: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.onRequest(),
        enabled: permissions ? this.userPermissionsService.hasAll(permissions) : of(true)
      }),
      exportExcel: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL,
        action: () => this.exportExcel(),
        enabled: permissions ? this.userPermissionsService.hasAll(permissions) : of(true)
      }),
    };
    return {
      title: config.title,
      items: config.items.map(item => titlebarItems[item.name](item.permissions))
    };
  }

  private exportExcel(): void {
    const grid = this.grid as Grid2Component;
    const filters = grid.getFilters();
    const params = grid.getRequestParams();
    const columns = grid.getExportableColumns();
    if (columns) {
      const request = this.gridService.buildRequest(params, filters);
      // NOTE: no paging in export, so remove it from the request
      const { paging, ...rest } = request;
      const body = { columns, ...rest };
      this.downloader.download(body);
    }
  }
}
