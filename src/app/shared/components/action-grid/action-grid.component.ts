import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GridOptions } from 'ag-grid';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, map, takeUntil, delay, switchMap, tap } from 'rxjs/operators';
import { never } from 'rxjs/observable/never';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { IContext } from '@app/core/context/context.interface';
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
import { IContextMenuParams } from '@app/shared/components/grids/context-menu/context-menu.interface';
import { IGridControlValue } from './excel-filter/excel-filter.interface';
import {
  IAGridAction,
  IAGridRequestParams,
  IAGridSelected,
  IAGridColumn,
  IAGridExportableColumn,
} from '../grid2/grid2.interface';

import { IMetadataDefs } from '../grid/grid.interface';
import {
  IMetadataAction,
  MetadataActionType,
  IMetadataTitlebar,
} from '@app/core/metadata/metadata.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ContextService } from '@app/core/context/context.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { ExcelFilteringService } from './excel-filtering.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridFilterComponent } from './filter/action-grid-filter.component';
import { ActionGridService } from './action-grid.service';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';
import { TitlebarComponent } from '@app/shared/components/titlebar/titlebar.component';

import { combineLatestAnd, flatten } from '@app/core/utils';
import { DialogFunctions } from '../../../core/dialog';
import { FilterObject } from '../grid2/filter/grid-filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    ActionGridService,
    ExcelFilteringService,
  ],
  selector: 'app-action-grid',
  templateUrl: 'action-grid.component.html',
})
export class ActionGridComponent<T> extends DialogFunctions implements OnInit, OnDestroy {
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
  private preventSelect$ = new Subject<void>();
  private subs = new Subscription();

  dialog: string;
  dialogData: IGridAction;
  displayExcelFilter = false;
  selectionActionData: IGridAction;
  selectionActionName: string;

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
    private contextService: ContextService,
    private customOperationService: CustomOperationService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
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
          selectionAction: this.selectionAction,
        }
      );
    }

    this.titlebar$ = this.getGridTitlebar();

   const selectActionSub = this.selectRow.pipe(
      filter(selection => selection && selection.length && !!this.currentSelectionAction),
      switchMap((selection) =>
        of(selection)
          .pipe(
            // NOTE: delay should be before takeUntil
            delay(200),
            takeUntil(this.preventSelect$),
          )
        )
      )
      .subscribe(s => {
        this.onSelectionAction(s);
      });

    const closeSelectActionSub = this.preventSelect$
      .subscribe(() => {
        this.gridDetails$.next(false);
      });

    this.subs.add(selectActionSub);
    this.subs.add(closeSelectActionSub);

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getGridPermission(permissionKey?: string): Observable<boolean> {
    return permissionKey ? this.userPermissionsService.has(permissionKey) : of(true);
  }

  readonly gridActions$: Observable<IMetadataAction[]> = this.actions$.pipe(
    filter(Boolean),
    switchMap(actions => {
      const flatActions = flatten(actions);
      return combineLatest<IMetadataAction>(...flatActions.map(action => this.processAction(action)))
      .pipe(
        map(processed => processed.reduce((acc, value) => Object.assign(acc, value), {})),
        map(processedFlatActions => this.actionGridService.setActionsData(actions, [
            a => ({ ...a, enabled: a.enabled || this.addPermission(a, processedFlatActions[a.action]) }),
            a => {
              const isDialog = !Object.keys(this.actionGridService.cbActions).includes(a.action);
              return { ...a, isDialog, cb: !isDialog ? this.actionGridService.cbActions[a.action] : null };
            },
        ])),
      );
    }),
    tap(actions => {
      this.currentDefaultAction = this.actionGridService.getAction(
        actions,
        action => action.action === this.defaultActionName
      );

      this.currentSelectionAction = this.actionGridService.getAction(
        actions,
          action => action.action === this.selectionActionName,
          (_actions: IMetadataAction[], _: IMetadataAction, index: number) => _actions.splice(index, 1)
      );
    })
  );

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

  readonly customActions$: Observable<IMetadataAction[]> = this.actions$
    .pipe(
      filter(Boolean),
      map(actions => actions.filter(action => !!action.id))
  );

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

    if (this.close) {
      this.close.emit(action);
    }

    this.setDialog();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.preventSelect$.next(null);

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
    this.rowIdKey = data.primary || this.rowIdKey || 'id';
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
      rowData: action.selection,
      asyncMode: action.metadataAction.asyncMode,
      outputConfig: action.metadataAction.outputConfig
    };
  }

  private processAction(action: IMetadataAction): Observable<any> {
    const config = this.getValidator(action);
    return this.contextService.calculate(config).pipe(
      map(computedValue => ( { [action.action]: Boolean(computedValue) } ) ),
    );
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

  private validateSelection(props: string[], selection: T[]): boolean {
    return selection.length && selection.some(s => props.every(prop => !!s[prop]));
  }

  private getValidator(action: IMetadataAction): IContext {
    const validatorGetter = this.actionGridService.actionValidators[action.action];
    // NOTE: if no associated validator is found, then this action will be allowed
    return validatorGetter ? validatorGetter(action) : true;
  }

  private addPermission(action: IMetadataAction, computedValue: boolean): (params: IContextMenuParams) => boolean {
      if (!action.id) {
        return this.attachValidator(computedValue);
      }
      return params => this.customOperationPerm(params);
  }
  // TODO(i.lobanov): move isAllowedOperation to actionValidators
  private customOperationPerm(params: IContextMenuParams): boolean {
    return params.action.type === MetadataActionType.ALL ? this.customOperationService.isAllowedOperation(params.action.id)
      : this.customOperationService.isAllowedOperation(params.action.id) && !!params.selected.length;
  }

  private attachValidator(computedValue: boolean): (params: IContextMenuParams) => boolean {
    return (params: IContextMenuParams) => params.action.type === MetadataActionType.ALL ?
      computedValue : this.validateSelection(params.action.params, params.selected) && computedValue;
  }
}
