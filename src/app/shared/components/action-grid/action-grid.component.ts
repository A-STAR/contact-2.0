import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  TemplateRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, map, takeUntil, delay, flatMap, switchMap, tap, mapTo } from 'rxjs/operators';
import { GridOptions } from 'ag-grid';
import { Observable } from 'rxjs/Observable';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';

import {
  DynamicLayoutGroupType,
  DynamicLayoutGroupMode,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import {
  ICloseAction,
  IGridAction,
  IActionGridAction,
} from './action-grid.interface';
import { IGridControlValue } from './excel-filter/excel-filter.interface';
import {
  IAGridAction,
  IAGridRequestParams,
  IAGridSelected,
  IAGridColumn,
  IAGridExportableColumn,
} from '../grid2/grid2.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IMetadataDefs } from '../grid/grid.interface';
import {
  IMetadataAction,
  MetadataActionType,
  IMetadataTitlebar,
  IMetadataActionPermissions,
} from '@app/core/metadata/metadata.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { ExcelFilteringService } from './excel-filtering.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridFilterComponent } from './filter/action-grid-filter.component';
import { ActionGridService } from './action-grid.service';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';
import { TitlebarComponent } from '@app/shared/components/titlebar/titlebar.component';

import { combineLatestAnd } from '@app/core/utils';
import { DialogFunctions } from '../../../core/dialog';
import { FilterObject } from '../grid2/filter/grid-filter';
import { ValueBag } from '@app/core/value-bag/value-bag';
import { startWith } from 'rxjs/operator/startWith';
import { Subject } from 'rxjs/Subject';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    ActionGridService,
    ExcelFilteringService,
  ],
  selector: 'app-action-grid',
  styleUrls: [ './action-grid.component.scss' ],
  templateUrl: 'action-grid.component.html',
})
export class ActionGridComponent<T> extends DialogFunctions implements OnInit {
  /**
   * These inputs are handling config,
   * passed directly from client code,
   * NOTE: They override config (if any) retrieved from the server!
   */
  @Input() actions: IMetadataAction[];
  @Input() defaultAction: string;
  @Input() selectionAction: string;
  @Input() columnIds: string[];
  @Input() toolbarItems: IToolbarItem[];
  // TODO(i.lobanov): make this work for grid2 as well
  @Input() columns: ISimpleGridColumn<T>;
  @Input() titlebar: IMetadataTitlebar;

  @Input() fullHeight = false;
  /**
   * Shows whether to use simple grid
   */
  @Input() isSimple = false;
  @Input() selectionType;
  @Input() ngClass: string;
  /**
   * If metadataKey is passed,
   * config retrieved from the server
   */
  @Input() metadataKey: string;
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
  @Input() styles: CSSStyleDeclaration;
  @Input() filterData: any;

  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();
  @Output() selectRow = new EventEmitter<IAGridSelected>();
  @Output() action = new EventEmitter<IActionGridAction>();
  // emits when dialog closes
  @Output() close = new EventEmitter<ICloseAction | IActionGridAction>();

  @ViewChild(ActionGridFilterComponent) filter: ActionGridFilterComponent;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;
  @ViewChild('grid') grid: SimpleGridComponent<T> | Grid2Component;
  @ViewChild('gridTpl', { read: TemplateRef }) gridTpl: TemplateRef<T>;
  @ViewChild('details', { read: TemplateRef }) details: TemplateRef<T>;
  @ViewChild(TitlebarComponent) gridBar: TitlebarComponent;

  initialized = false;
  templates: Record<string, TemplateRef<any>>;

  private _columns: IAGridColumn[];

  private actions$ = new BehaviorSubject<any[]>(null);
  private titlebarConfig$ = new BehaviorSubject<IMetadataTitlebar>(null);
  private defaultActionName: string;
  private currentDefaultAction: IMetadataAction;
  private currentSelectionAction: IMetadataAction;
  private excelFilter$ = new BehaviorSubject<FilterObject>(null);
  private gridDetails$ = new BehaviorSubject<boolean>(false);
  private dblClick$ = new Subject<void>();

  dialog: string;
  dialogData: IGridAction;
  displayExcelFilter = false;
  selectionActionData: IGridAction;
  selectionActionName: string;

  gridActions$: Observable<IMetadataAction[]>;
  titlebar$: Observable<ITitlebar>;
  layoutConfig: IDynamicLayoutConfig = {
    key: 'action-grid',
    items: [
      {
        type: DynamicLayoutItemType.GROUP,
        groupType: DynamicLayoutGroupType.HORIZONTAL,
        mode: DynamicLayoutGroupMode.SPLITTERS,
        size: 100,
        children: [
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'gridTpl',
            size: 65,
          },
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'details',
            size: 35,
            displaySplit: this.gridDetails$
          },
        ]
      }
    ],
  };

  constructor(
    private actionGridService: ActionGridService,
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService,
    private entityAttributesService: EntityAttributesService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    // get data from the server
    if (this.metadataKey) {
      this.getMetadata();
    } else {
      // proceed manually
      this.initGrid(
        {
          actions: this.actions,
          titlebar: this.titlebar,
          defaultAction: this.defaultAction,
          selectionAction: this.selectionAction
        }
      );
    }

    this.gridActions$ = this.getGridActions();
    this.titlebar$ = this.getGridTitlebar();

    this.selectRow.pipe(
        filter(selection => selection && selection.length && !!this.currentSelectionAction),
        switchMap((selection) => {
          return of(selection)
          .pipe(
            takeUntil(this.dblClick$),
            delay(200),
          );
        }
    )).subscribe(s => {
      console.log(`Selection: ${s}`);
      this.onSelectionAction(s);
    });


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
      .pipe(
          map(([actions, constants, permissions, entityPermissions]) => {

            const actionsWithPermissions = this.processActions(actions, constants, permissions, entityPermissions);

            this.currentDefaultAction = this.actionGridService.getAction(
              actionsWithPermissions,
              action => action.action === this.defaultActionName
            );

            this.currentSelectionAction = this.actionGridService.getAction(
                actionsWithPermissions,
                action => action.action === this.selectionActionName,
                (_actions: IMetadataAction[], _: IMetadataAction, index: number) => _actions.splice(index, 1)
            );

            return actionsWithPermissions;
        })
      );
  }

  getGridTitlebar(): Observable<ITitlebar> {
    return this.titlebarConfig$
      .pipe(
        filter(Boolean),
        map(config => this.buildTitlebar(config))
      );
  }

  get selection(): T[] {
    return this.isSimple ?
      (this.grid as SimpleGridComponent<T>).selection : (this.grid as Grid2Component).selected;
  }

  isGridDetails(name: string): boolean {
    return this.selectionActionName === name && this.currentSelectionAction && !!this.selectionActionData;
  }

  get hasPagination(): boolean {
    return !!this.metadataKey;
  }

  get customActions$(): Observable<IMetadataAction[]> {
    return this.actions$
      .pipe(
        filter(Boolean),
        map(actions => actions.filter(action => !!action.id))
      );
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

  deselectAll(): void {
    if (this.grid) {
      this.grid.deselectAll();
    }
  }

  onAction(gridAction: IAGridAction): void {
    const action = {
      metadataAction: gridAction.metadataAction,
      selection: gridAction.selection.node.data
    };
    if (action.metadataAction.isDialog) {
      this.dialog = action.metadataAction.action;
      this.dialogData = this.setDialogData(action);
    } else if (action.metadataAction.cb) {
      action.metadataAction.cb(this.setDialogData(action), this.createCloseAction(action) );
    }
    if (this.action) {
      this.action.emit(action);
    }
    this.cdRef.markForCheck();
  }

  onSelectionAction(selected: Array<number | T>): void {
    const selection = this.grid instanceof Grid2Component
      ? this.selection.find(r => r[this.rowIdKey] === selected[0])
      : selected[0];
    this.selectionActionData = this.setDialogData({ metadataAction: this.currentSelectionAction, selection });
    this.gridDetails$.next(this.isGridDetails(this.selectionActionName));
    this.cdRef.markForCheck();
  }

  onCloseAction(action: ICloseAction = {}): void {
    if (action.refresh) {
      this.onRequest();
    }
    if (action.deselectAll) {
      this.grid.deselectAll();
    }
    this.onCloseDialog();

    if (this.close) {
      this.close.emit(action);
    }
    this.cdRef.markForCheck();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.dblClick$.next(null);
    if (this.currentDefaultAction) {
      const action: IActionGridAction = {
        selection: row,
        metadataAction: {
          ...this.currentDefaultAction,
          type: MetadataActionType.SINGLE
        }
      };
      if (this.currentDefaultAction.isDialog) {
        this.dialog = action.metadataAction.action;
        this.dialogData = this.setDialogData(action);
      } else if (action.metadataAction.cb) {
        action.metadataAction.cb(this.setDialogData(action), this.createCloseAction(action));
      }
      this.cdRef.markForCheck();
    } else if (this.dblClick) {
      this.dblClick.emit(row);
    }
  }

  onSelect(selected: number[]): void {
    this.selectRow.emit(selected);
  }

  getExportableColumns(): IAGridExportableColumn[] {
    return this.grid instanceof Grid2Component
      ? this.grid.getExportableColumns()
      : null;
  }

  onExcelFilterSubmit(event: IGridControlValue[]): void {
    const excelFilter = FilterObject.create().and();
    event.forEach(item => {
      const f = FilterObject.create()
        .setList(item.guid)
        .setName(item.columnId)
        .setOperator('IN');
      excelFilter.addFilter(f);
    });
    this.excelFilter$.next(excelFilter);
    this.displayExcelFilter = false;
    this.onRequest();
    this.cdRef.markForCheck();
  }

  onExcelFilterClose(): void {
    this.displayExcelFilter = false;
    this.cdRef.markForCheck();
  }

  onDetailsClose(): void {
    this.gridDetails$.next(false);
    this.grid.deselectAll();
  }

  get gridOptions(): GridOptions {
    return this.grid && this.gridOptions;
  }

  get columnsDef(): IAGridColumn[] {
    return this._columns || [];
  }

  private createCloseAction(actionData: ICloseAction | IActionGridAction): () => any {
    return () => this.close ? this.close.emit(actionData) : actionData;
  }

  private getMetadata(): void {
    this.getGridPermission(this.permissionKey)
      .switchMap(isAllowed => {
        if (isAllowed) {
          return this.gridService.getMetadata(this.metadataKey, {});
        }
        this.notificationsService.permissionError().entity(`entities.${this.metadataKey}.gen.plural`).dispatch();
        return never();
      })
      .pipe(first())
      .subscribe(this.initGrid.bind(this));
  }

  private initGrid(data: IMetadataDefs): void {
    this.actions$.next(data.actions || this.actions);
    this.defaultActionName = data.defaultAction;
    this.selectionActionName = data.selectionAction || ActionGridService.DefaultSelectionAction;
    this.titlebarConfig$.next(data.titlebar || this.titlebar);
    this._columns = data.columns ? [...data.columns] : null;
    this.initialized = true;
    this.templates = { gridTpl: this.gridTpl, details: this.details };
    this.cdRef.markForCheck();
  }

  private getGridFilters(): FilterObject {
    const filters = (this.grid as Grid2Component).getFilters();
    if (this.filter) {
      filters.addFilter(this.filter.filters);
    }
    if (this.excelFilter$.value) {
      filters.addFilter(this.excelFilter$.value);
    }
    return filters;
  }

  private setDialogData(action: IActionGridAction): IGridAction {
    return {
      id: action.metadataAction.id,
      name: action.metadataAction.action,
      addOptions: action.metadataAction.addOptions,
      params: action.metadataAction.params,
      payload: this.actionGridService.getPayload(action, {
        selection: this.selection,
        metadataKey: this.metadataKey,
        filters: this.getFilters()
      }),
      selection: this.actionGridService.getGridSelection(action, this.selection),
      asyncMode: action.metadataAction.asyncMode,
      inputConfig: action.metadataAction.inputConfig,
      outputConfig: action.metadataAction.outputConfig
    };
  }

  private processActions(actions: IMetadataAction[], constants: ValueBag, permissions: ValueBag,
      entityPerms: IEntityAttributes): IMetadataAction[] {

    const actionPermissions = this.buildPermissions(actions, constants, permissions, entityPerms);

    return this.actionGridService.attachActionData(actions, [
      action => ({ ...action, enabled: action.enabled || actionPermissions[action.action] }),
      action => {
        const isDialog = !Object.keys(this.actionGridService.cbActions).includes(action.action);
        return { ...action, isDialog, cb: !isDialog ? this.actionGridService.cbActions[action.action] : null };
      },
    ]);
  }

  private buildTitlebar(config: IMetadataTitlebar): ITitlebar {
    // TODO(i.lobanov): move to action grid service and refactor
    const titlebarItems = {
      refresh: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.onRequest(),
        enabled: this.isTbItemEnabled$(TitlebarItemTypeEnum.BUTTON_REFRESH, permissions),
      }),
      search: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.onRequest(),
        enabled: this.isTbItemEnabled$(TitlebarItemTypeEnum.BUTTON_SEARCH, permissions),
      }),
      exportExcel: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL,
        action: () => this.exportExcel(),
        enabled: this.isTbItemEnabled$(TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL, permissions),
      }),
      filter: (permissions: string[]) => ({
        type: TitlebarItemTypeEnum.BUTTON_FILTER,
        action: () => this.openFilter(),
        enabled: this.isTbItemEnabled$(TitlebarItemTypeEnum.BUTTON_FILTER, permissions),
        classes: this.excelFilter$.pipe(
          map(excelFilter => excelFilter && excelFilter.hasFilter()),
          map(active => active ? 'button-active' : null)
        ),
      }),
    };
    return {
      title: config.title,
      items: config.items
        .concat([
          { name: 'filter', permissions: null },
        ])
        .map(item => titlebarItems[item.name](item.permissions)),
    };
  }

  private isTbItemEnabled$(itemType: TitlebarItemTypeEnum, permissions?: string[]): Observable<boolean> {
    const conditions = [ permissions ? this.userPermissionsService.hasAll(permissions) : of(true) ];
    switch (itemType) {
      case TitlebarItemTypeEnum.BUTTON_SEARCH:
        conditions.push(this.filter.isValid$);
        break;
      case TitlebarItemTypeEnum.BUTTON_REFRESH:
      case TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL:
      default:
        // do nothing
        break;
    }
    return combineLatestAnd(conditions);
  }

  private openFilter(): void {
    this.displayExcelFilter = true;
    this.cdRef.markForCheck();
  }

  private exportExcel(): void {
    const grid = this.grid as Grid2Component;
    const filters = this.getGridFilters();
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
      changeStageAttr: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
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
      mapAddressView: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('MAP_ADDRESS_VIEW') : selection.length && permissions.has('MAP_ADDRESS_VIEW'),
      mapContactView: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('MAP_CONTACT_VIEW') : selection.length && permissions.has('MAP_CONTACT_VIEW'),
      // TODO(d.maltsev, i.kibisov): pass entityTypeId
      objectAddToGroup: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.contains('ADD_TO_GROUP_ENTITY_LIST', 19) : selection.length
          && permissions.contains('ADD_TO_GROUP_ENTITY_LIST', 19),
      openUserDetail: (_: MetadataActionType, __, row) => row && row.userId
        && permissions.has('OPERATOR_DETAIL_VIEW'),
      paymentsCancel: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PAYMENT_CANCEL') : selection.length && permissions.has('PAYMENT_CANCEL'),
      paymentsConfirm: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PAYMENT_CONFIRM') : selection.length && permissions.has('PAYMENT_CONFIRM'),
      prepareVisit: (actionType: MetadataActionType, selection, row) => actionType === MetadataActionType.ALL ?
        permissions.has('VISIT_PREPARE') : row.visitId && selection.length && permissions.has('VISIT_PREPARE'),
      rejectPaymentsOperator: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
      permissions.has('PAYMENTS_OPERATOR_CHANGE') : selection.length && permissions.has('PAYMENTS_OPERATOR_CHANGE'),
      showContactHistory: (_: MetadataActionType, __, row) => row && row.personId
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
      registerContact: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        of(true) : selection.length && of(true),
      changePersonType: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL ?
        permissions.has('PERSON_INFO_EDIT') : selection.length && permissions.has('PERSON_INFO_EDIT'),
      ...actions
        .filter(action => !!action.id)
        .reduce((acc, action) => ({
          ...acc,
          [action.action]: (actionType: MetadataActionType, selection) => actionType === MetadataActionType.ALL
            ? this.customOperationService.isAllowedOperation(action.id)
            : this.customOperationService.isAllowedOperation(action.id) && selection.length
        }), {})
    };
  }
}
