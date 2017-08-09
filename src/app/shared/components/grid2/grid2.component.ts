import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import * as R from 'ramda';
import { TranslateService } from '@ngx-translate/core';
import {
  ColDef, Column, ColumnChangeEvent, GetContextMenuItemsParams,
  GridOptions, ICellRendererParams, MenuItemDef, RowNode,
} from 'ag-grid/main';
import { PostProcessPopupParams } from 'ag-grid-enterprise';
import {
  IToolbarAction,
  IToolbarActionSelect,
  ToolbarActionTypeEnum,
  ToolbarControlEnum
} from '../toolbar/toolbar.interface';
import {
  IAGridEventPayload, IAGridExportableColumn, IAGridGroups, IAGridSelected,
  IAGridColumn, IAGridSortModel, IAGridSettings, IAGridRequestParams } from './grid2.interface';
import { FilterObject } from './filter/grid-filter';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { PersistenceService } from '../../../core/persistence/persistence.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { GridDatePickerComponent } from './datepicker/grid-date-picker.component';
import { GridTextFilter } from './filter/text-filter';
import { ViewPortDatasource } from './data/viewport-data-source';

interface ITranslations {
  translations: { [index: string]: string };
}

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './grid2.component.scss',
    './grid2.component.ag-base.scss',
    './grid2.component.theme.scss',
  ],
})
export class Grid2Component implements OnInit, OnChanges, OnDestroy {
  static DEFAULT_PAGE_SIZE = 250;

  static FIRST_PAGE         = 'AGRID_FIRST_PAGE';
  static LAST_PAGE          = 'AGRID_LAST_PAGE';
  static NEXT_PAGE          = 'AGRID_NEXT_PAGE';
  static PREVIOUS_PAGE      = 'AGRID_PREVIOUS_PAGE';
  static PAGE_SIZE          = 'AGRID_PAGE_SIZE';
  static SORT_COLUMNS       = 'AGRID_SORT_COLUMNS';
  static GROUP_COLUMNS      = 'AGRID_GROUP_COLUMNS';
  static SELECTED_ROWS      = 'AGRID_SELECTED_ROWS';
  static DESTROY_STATE      = 'AGRID_DESTROY_STATE';

  @Input() disableFilters = false;
  @Input() groupColumnMinWidth = 120;
  @Input() headerHeight = 25;
  @Input() metadataKey: string;
  @Input() pageSize = Grid2Component.DEFAULT_PAGE_SIZE;
  @Input() pagination = true;
  @Input() pageSizes = Array.from(new Set([this.pageSize, 100, 250, 500, 1000]))
    .sort((x, y) => x > y ? 1 : -1);
  @Input() persistenceKey: string;
  @Input() remoteSorting = true;
  @Input() rowCount = 0;
  @Input() rowHeight = 25;
  @Input() rowIdKey = 'id';
  @Input() rows: any[] = [];
  @Input() rowSelection = 'multiple';
  @Input() showDndGroupPanel = false;
  @Input() startPage = 1;
  @Input() styles: CSSStyleDeclaration;

  @Output() onDragStarted = new EventEmitter<null>();
  @Output() onDragStopped = new EventEmitter<null>();
  @Output() onColumnGroup = new EventEmitter<IAGridGroups>();
  // NOTE: emits the `.data` property of RowNode
  @Output() onDblClick = new EventEmitter<RowNode[]>();
  @Output() onFilter = new EventEmitter<FilterObject>();
  @Output() onPage = new EventEmitter<number>();
  @Output() onInit = new EventEmitter<void>();
  @Output() onPageSize = new EventEmitter<number>();
  @Output() onSort = new EventEmitter< IAGridSortModel[]>();
  @Output() onSelect = new EventEmitter<IAGridSelected>();

  columns: IAGridColumn[];
  columnDefs: ColDef[];
  gridOptions: GridOptions = {};
  page: number = this.startPage;
  paginationPanel: IToolbarAction[] = [];
  initCallbacks: Function[] = [];

  private gridSettings: IAGridSettings;
  private initialized = false;
  private langSubscription: EventEmitter<any>;
  private viewportDatasource: ViewPortDatasource;

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private gridService: GridService,
    private notificationService: NotificationsService,
    private persistenceService: PersistenceService,
    private translate: TranslateService,
    private valueConverter: ValueConverterService,
  ) {}

  get allColumns(): Column[] {
    return this.gridOptions.columnApi.getAllGridColumns();
  }

  // selected rows
  get selected(): RowNode[] {
    return this.gridOptions.api ? this.gridOptions.api.getSelectedRows() : [];
  }

  ngOnInit(): void {
    this.viewportDatasource = new ViewPortDatasource(this);
    if (!this.persistenceKey) {
      console.warn('Please provide the [persistenceKey] or the grid will not be able to save its settings');
    }
    if (!this.metadataKey) {
      throw new Error(`Can't initialise since no [metadataKey] key provided.`);
    }

    this.gridService
      .getColumnMeta(this.metadataKey, {})
      .take(1)
      .subscribe(columns => {
        const { colDefs } = this.restoreGridSettings();

        this.columns = columns.slice();
        this.columnDefs = this.setColumnDefs(colDefs);
        this.setGridOptions();
        this.setPagination();

        this.initialized = true;
        this.cdRef.markForCheck();
        this.onInit.emit();
      });

      this.langSubscription = this.translate.onLangChange
        .subscribe((translations: ITranslations) => this.refreshTranslations(translations.translations));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }
    const { rowCount, rows } = changes;
    if (rows) {
      this.refreshPagination();
      this.clearRangeSelections();
      this.viewportDatasource.params.setRowData(this.rows);
    }
    if (rowCount) {
      this.viewportDatasource.params.setRowCount(rowCount.currentValue);
      this.refreshRowCount();
      if (rowCount.currentValue) {
        this.gridOptions.api.hideOverlay();
      } else {
        this.gridOptions.api.showNoRowsOverlay();
      }
    }
  }

  ngOnDestroy(): void {
    this.saveGridSettings();
    this.langSubscription.unsubscribe();
  }

  onPageChange(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.GO_BACKWARD:
        if (this.page === 1) {
          this.notificationService.info(`Can't fetch page no ${this.page}`).noAlert().dispatch();
          return;
        }
        this.onPage.emit(--this.page);
        break;
      case ToolbarActionTypeEnum.GO_FORWARD:
        if ((this.page + 1) >= this.getPageCount()) {
          this.notificationService.info(`No more data can be loaded`).noAlert().dispatch();
          return;
        }
        this.onPage.emit(++this.page);
        break;
      case ToolbarActionTypeEnum.GO_FIRST:
        this.page = 1;
        this.onPage.emit(1);
        break;
      case ToolbarActionTypeEnum.GO_LAST:
        this.page = this.getPageCount();
        this.onPage.emit(this.page);
        break;
    }
  }

  onPageSizeChange(payload: IToolbarActionSelect): void {
    const newSize = payload.value[0].value;
    console.log('new page size', newSize);
    this.pageSize = newSize || this.pageSize;
    this.onPageSize.emit(this.pageSize);
  }

  dragStarted(): void {
    // does nothing, for debugging only
    this.onDragStarted.emit();
  }

  dragStopped(): void {
    this.onDragStopped.emit();
  }

  onSelectionChanged(): void {
    const selected = this.selected.map(row => row[this.rowIdKey]);
    this.refreshRowCount();
    this.onSelect.emit(selected);
  }

  rowDoubleClicked(): void {
    this.onDblClick.emit(this.selected);
  }

  onFilterChanged(): void {
    const filters = this.getFilters();
    this.page = 1;
    this.onFilter.emit(filters);
  }

  getFilters(): FilterObject {
    const filterModel = this.gridOptions.api.getFilterModel();
    const filters = Object.keys(filterModel)
      .map(key => {
        const filter: any = { name: key };
        const model = filterModel[key];
        switch (model.filterType) {
          case 'date':
            filter.operator = 'BETWEEN';
            filter.values = this.valueConverter.makeRangeFromLocalDate(model.dateFrom);
            break;
          case 'text':
            Object.assign(filter, this.getTextFilter(model));
            break;
          case 'number':
            Object.assign(filter, this.getNumberFilter(model));
            break;
          // NOTE: `set` filter doesn't return the `filterType` => WTF?
          default:
          case 'set':
            filter.operator = 'IN';
            const column = this.columns.find(col => col.colId === key);
            if (column && column.filterValues && Array.isArray(model)) {
              filter.values = model.map(value => column.filterValues.find(val => val.name === value))
                .map(val => val.code);
            } else {
              filter.values = [];
            }
            if (!filter.values.length) {
              filter.operator = '==';
              filter.values = null;
            }
            break;
        }
        return filter;
      });

    return FilterObject
      .create()
      .and()
      .setFilters(filters);
  }

  onSortChanged(): void {
    this.calculateGridSettings();
    const sorters: IAGridSortModel[] = this.getSorters();
    this.onSort.emit(sorters);
  }

  getSorters(): any {
    return this.gridOptions.api.getSortModel();
  }

  getExportableColumns(): IAGridExportableColumn[] {
    return this.allColumns
      .filter(column => column.isVisible())
      .map(column => {
        const { field, headerName: name } = column.getColDef();
        return { field, name };
      });
  }

  getRequestParams(): IAGridRequestParams {
    const sorters = this.getSorters();
    const { pageSize, page: currentPage } = this;
    return { currentPage, pageSize, sorters };
  }

  private getTextFilter(model: any): any {
    const { filter, type } = model;
    const operators = {
      equals: '==',
      notEqual: '!=',
      contains: 'LIKE',
      notContains: 'NOT LIKE',
      startsWith: 'LIKE',
      endsWith: 'LIKE',
    };
    const patterns = {
      contains: '%{v}%',
      notContains: '%{v}%',
      startsWith: '{v}%',
      endsWith: '%{v}',
    };
    const result = {
      operator: operators[type],
      values: [],
    };
    if (['equals', 'notEqual'].includes(type)) {
      result.values = [filter];
    } else {
      result.values = [patterns[type].replace('{v}', filter)];
    }
    return result;
  }

  private getNumberFilter(model: any): any {
    // NOTE: `filter` here means `filterFrom`
    const { filter, filterTo, type } = model;
    const operators = {
      lessThan: '<',
      greaterThan: '>',
      lessThanOrEqual: '<=',
      greaterThanOrEqual: '>=',
      equals: '==',
      notEqual: '!=',
      inRange: 'BETWEEN',
    };
    const result = {
      operator: operators[type],
      values: [],
    };
    if (type === 'inRange') {
      result.values = [filter, filterTo];
    } else {
      result.values = [filter];
    }
    return result;
  }

  private setPagination(): void {
    if (!this.pagination) {
      return;
    }

    this.paginationPanel = [
      { control: ToolbarControlEnum.LABEL, text: '0 выбрано / 0 всего' },
      { type: ToolbarActionTypeEnum.GO_FIRST, disabled: true },
      { type: ToolbarActionTypeEnum.GO_BACKWARD, disabled: true },
      { control: ToolbarControlEnum.LABEL, text: '0 / 0' },
      { type: ToolbarActionTypeEnum.GO_FORWARD, disabled: true },
      { type: ToolbarActionTypeEnum.GO_LAST, disabled: true },
      {
        activeValue: Grid2Component.DEFAULT_PAGE_SIZE,
        control: ToolbarControlEnum.SELECT,
        disabled: true,
        styles: { width: '100px' },
        value: this.pageSizes.map(pageSize => ({ value: pageSize })),
      }
    ];
  }

  private refreshRowCount(): void {
    const countText = this.translate.instant(
      'default.grid.selectedCounts',
      { length: this.rowCount, selected: this.selected.length }
    );
    this.paginationPanel = this.paginationPanel.map((btn, i) => {
      if (i === 0) {
        btn.text = countText;
      }
      return btn;
    });
  }

  private refreshPagination(): void {
    if (!this.pagination) {
      return;
    }

    const canPaginate: boolean = this.rowCount > this.pageSize;
    const pageCount = this.getPageCount();
    const pages = `${this.page} / ${pageCount || 0}`;

    this.paginationPanel = this.paginationPanel.map((btn, i) => {
      switch (i) {
        case 1:
          // goFirstBtn
          btn.disabled = !canPaginate || this.page === 1;
          return btn;
        case 2:
          // goBackBtn
          btn.disabled = !canPaginate || this.page === 1;
          return btn;
        case 3:
          // page of pages
          btn.text = pages;
          return btn;
        case 4:
          // goForwardBtn
          btn.disabled = !canPaginate || this.page === pageCount;
          return btn;
        case 5:
          // goLastBtn
          btn.disabled = !canPaginate || this.page === pageCount;
          return btn;
        case 6:
          // pageSize selector
          btn.disabled = !canPaginate;
          return btn;
        default:
          return btn;
      }
    });
  }

  private refreshTranslations(translations: { [index: string]: any }): void {
    this.refreshRowCount();
    this.translateOptionsMessages();
    this.gridOptions.autoGroupColumnDef.headerName = this.translate.instant('default.grid.groupColumn');

    this.cdRef.markForCheck();
  }

  private translateOptionsMessages(): any {
    return Object.assign(
      this.gridOptions.localeText,
      { rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle') },
      this.translate.instant('default.grid.localeText')
    );
  }

  private clearRangeSelections(): void {
    this.gridOptions.api.clearRangeSelection();
    this.gridOptions.api.clearFocusedCell();
  }

  private getRendererByName(field: string): Function {
    return this.columns.find(column => column.colId === field).renderer;
  }

  private getPageCount(): number {
    return Math.ceil(this.rowCount / this.pageSize);
  }

  private getCustomFilter(column: IAGridColumn): any {
    const filterMap = {
      '1': 'number',
      '3': 'text',
      '6': 'set',
      '7': 'date',
      'default': GridTextFilter,
    };
    return R.propOr('text', String(column.dataType))(filterMap);
  }

  private getCustomFilterParams(column: IAGridColumn): any {
    if (column.filterValues) {
      return {
        values: column.filterValues.map(item => item.name),
        cellRenderer: (node: { value: string }) => node.value,
        suppressMiniFilter: true,
        apply: true,
      };
    }
    return {};
  }

  private setColumnDefs(savedColDefs: ColDef[]): ColDef[] {
    const mapColumns = (column: IAGridColumn, originalIndex: number) => {
      // need indices to sort the columns
      let index;
      const colDef: ColDef = {
        colId: column.colId,
        field: column.colId,
        filter: this.getCustomFilter(column),
        filterParams: this.getCustomFilterParams(column),
        headerName: column.label,
        hide: !!column.hidden,
        maxWidth: column.maxWidth,
        minWidth: column.minWidth,
        width: column.width || column.minWidth || column.maxWidth,
      };
      // Merge persisted column settings, if any
      if (savedColDefs) {
        index = savedColDefs.findIndex(col => col.colId === column.colId);
        // tslint:disable-next-line:no-bitwise
        if (!!~index) {
          Object.assign(colDef, savedColDefs[index]);
        }
      } else {
        index = 0;
      }

      switch (column.type) {
        case 'number':
          colDef.cellClass = 'ag-cell-number';
          break;
        case 'date':
          colDef.floatingFilterComponentParams = { suppressFilterButton: true };
          colDef.suppressSizeToFit = true;
          break;
      }
      if (column.renderer) {
        colDef.cellRenderer = (params: ICellRendererParams) => column.renderer(params.data);
        colDef.valueGetter = colDef.cellRenderer;
      }

      return { column: colDef, index, originalIndex };
    };

    return this.columns
      .filter(column => !!column.label)
      .map(mapColumns)
      // ES6 sort is not necessarily stable: http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort
      .sort((a, b) => a.index === b.index ? a.originalIndex - b.originalIndex : a.index - b.index)
      .map(item => item.column);
  }

  private setGridOptions(): void {
    this.gridOptions = {
      autoGroupColumnDef: {
        headerName: this.translate.instant('default.grid.groupColumn'),
        minWidth: this.groupColumnMinWidth,
        suppressMenu: true,
        suppressMovable: true,
        suppressFilter: true,
        cellRenderer: 'group',
        cellRendererParams: {
          innerRenderer: (params) => {
            const rowNode: RowNode = params.node;
            const { field } = rowNode;
            if (rowNode.group && rowNode.allLeafChildren.length) {
              const renderer = this.getRendererByName(field);
              const data = rowNode.allLeafChildren[0].data;
              return renderer
                ? renderer(data)
                : (data[field] || rowNode.rowGroupColumn.getColDef().headerName);
            }
            return '';
          },
        }
      },
      dateComponentFramework: GridDatePickerComponent,
      debug: false,
      defaultColDef: {
        enableRowGroup: false,
        filterParams: {
          // keeps the data filtered when new rows arrive
          newRowsAction: 'keep',
        },
        headerComponentParams: {
          headerHeight: this.headerHeight,
          enableMenu: false,
        },
        // icons: {
        //   sortAscending: '<i class="fa fa-sort-amount-asc"/>',
        //   sortDescending: '<i class="fa fa-sort-amount-desc"/>'
        // },
        /* to set the menu tabs for a column */
        // menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        suppressMenu: true,
      },
      enableColResize: true,
      enableRangeSelection: true,
      enableServerSideFilter: true,
      enableServerSideSorting: true,
      floatingFilter: !this.disableFilters,
      getContextMenuItems: this.getContextMenuItems.bind(this),
      getMainMenuItems: (params) => {
        // hide the tool menu
        return params.defaultItems.slice(0, params.defaultItems.length - 1);
      },
      headerHeight: this.headerHeight,
      // NOTE: There is a huge translation under `localeText` pulled from *.json
      localeText: {},
      // overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">This is a custom \'no rows\' overlay</span>',
      pagination: this.pagination,
      paginationAutoPageSize: false,
      paginationPageSize: this.pageSize,
      postProcessPopup: this.postProcessPopup,
      rowDeselection: true,
      rowGroupPanelShow: this.showDndGroupPanel ? 'always' : '',
      rowHeight: this.rowHeight,
      rowModelType: 'viewport',
      viewportDatasource: this.viewportDatasource,
      getRowNodeId: row => row[this.rowIdKey],
      rowSelection: this.rowSelection,
      showToolPanel: false,
      suppressMenuHide: true,
      suppressPaginationPanel: true,
      suppressRowHoverClass: true,
      suppressScrollOnNewData: true,
      toolPanelSuppressRowGroups: true,
      toolPanelSuppressValues: true,
      toolPanelSuppressPivots: true,
      toolPanelSuppressPivotMode: true,
      viewportRowModelPageSize: this.pageSize,
      viewportRowModelBufferSize: 0,
      isExternalFilterPresent: () => !this.disableFilters,
      doesExternalFilterPass: (node: RowNode) => true,
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event),
      onFilterChanged: this.onFilterChanged.bind(this),
      onGridReady: () => this.onGridReady(),
      // onGridSizeChanged: (params) => this.onGridSizeChanged(),
      onColumnResized: () => this.calculateGridSettings(),
      onColumnVisible: () => this.calculateGridSettings(),
      onColumnMoved: () => this.calculateGridSettings(),
      onSelectionChanged: this.onSelectionChanged.bind(this),
      onSortChanged: this.onSortChanged.bind(this),
    };

    this.translateOptionsMessages();
  }

  private getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    return [
      {
        name: 'Alert value',
        action: () => { window.alert('Alerting about ' + params.value); },
      },
      {
        name: 'Always disabled',
        disabled: true,
        tooltip: 'Just to test what the tooltip can show'
      },
      // {
      //   name: 'Person',
      //   subMenu: [
      //     {name: 'Niall', action: () => {console.log('Niall was pressed'); } },
      //     {name: 'Sean', action: () => {console.log('Sean was pressed'); } },
      //     {name: 'John', action: () => {console.log('John was pressed'); } },
      //     {name: 'Alberto', action: () => {console.log('Alberto was pressed'); } },
      //     {name: 'Tony', action: () => {console.log('Tony was pressed'); } },
      //     {name: 'Andrew', action: () => {console.log('Andrew was pressed'); } },
      //     {name: 'Lola', action: () => {console.log('Lola was pressed'); } },
      //   ]
      // },
      'separator',
      {
        name: 'Checked',
        checked: true,
        action: () => { console.log('Checked Selected'); }
      },
      'copy',
      'copyWithHeaders',
      'separator',
      {
        name: 'Reset columns',
        action: () => this.resetGridSettings(),
        shortcut: 'Alt+R'
      }
    ];
  }

  /**
   * Reposition the popup to appear right below the button
   * https://www.ag-grid.com/javascript-grid-column-menu/#gsc.tab=0
   */
  private postProcessPopup(params: PostProcessPopupParams): void {
    if (params.type !== 'columnMenu') {
      return;
    }
    // We can get the column id, which is a prop
    // const columnId = params.column.getId();
    const px = 'px';
    const { ePopup } = params;
    const oldTop = ePopup.style.top.replace(px, '');
    const newTop = parseInt(oldTop, 10) + 25;
    const oldLeft = ePopup.style.left.replace(px, '');
    const newLeft = parseInt(oldLeft, 10) + 9;

    ePopup.style.top = newTop + px;
    ePopup.style.left = newLeft + px;
  }

  private onColumnRowGroupChanged(event: ColumnChangeEvent): void {
    // NOTE: emit colId's only as an array
    this.onColumnGroup.emit(event.getColumns().map(column => column.getColId()));
  }

  private calculateGridSettings(): void {
    const sortModel = this.gridOptions.api.getSortModel();
    const colDefs: ColDef[] = this.allColumns.map(column => (
      { width: column.getActualWidth(), hide: !column.isVisible(), colId: column.getColId() }
    ));
    this.gridSettings = { sortModel, colDefs };
  }

  private resetGridSettings(): void {
    if (this.persistenceKey) {
      this.gridSettings = { sortModel: [], colDefs: [] };
    }
    this.saveGridSettings();
    this.gridOptions.api.setSortModel(null);
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.columnApi.resetColumnState();
  }

  private saveGridSettings(): void {
    if (this.persistenceKey) {
      this.persistenceService.set(this.persistenceKey, this.gridSettings);
    }
  }

  private restoreGridSettings(): IAGridSettings {
    this.gridSettings = this.persistenceService.get(this.persistenceKey) || {};
    return this.gridSettings;
  }

  private setSortModel(): void {
    const { sortModel } = this.gridSettings || this.restoreGridSettings();
    this.gridOptions.api.setSortModel(sortModel);
  }

  private onGridReady(): void {
    this.setSortModel();
    this.initCallbacks.forEach((cb: Function) => cb());
    this.initCallbacks = [];
  }
}
