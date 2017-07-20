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
  ColDef, Column, ColumnChangeEvent,
  GridOptions, ICellRendererParams, RowNode,
} from 'ag-grid/main';
import { PostProcessPopupParams } from 'ag-grid-enterprise';
import {
  IToolbarAction,
  IToolbarActionSelect,
  ToolbarActionTypeEnum,
  ToolbarControlEnum
} from '../toolbar/toolbar.interface';
import {
  IGrid2EventPayload, IGrid2ExportableColumn,
  IAGridColumn, IAGridSortModel, IAGridSettings } from './grid2.interface';
import { FilterObject } from './filter/grid2-filter';

import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { GridDatePickerComponent } from './datepicker/grid-date-picker.component';
import { GridTextFilter } from './filter/text-filter';
import { ViewPortDatasource } from './data/viewport-data-source';

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

  static FIRST_PAGE         = 'GRID2_FIRST_PAGE';
  static LAST_PAGE          = 'GRID2_LAST_PAGE';
  static NEXT_PAGE          = 'GRID2_NEXT_PAGE';
  static PREVIOUS_PAGE      = 'GRID2_PREVIOUS_PAGE';
  static PAGE_SIZE          = 'GRID2_PAGE_SIZE';
  static SORTING_DIRECTION  = 'GRID2_SORTING_DIRECTION';
  static GROUPING_COLUMNS   = 'GRID2_GROUPING_COLUMNS';
  static SELECTED_ROWS      = 'GRID2_SELECTED_ROWS';
  static MOVING_COLUMN      = 'GRID2_MOVING_COLUMN';
  static DESTROY_STATE      = 'GRID2_DESTROY_STATE';

  @Input() columns: IAGridColumn[] = [];
  @Input() columnTranslationKey: string;
  @Input() filterEnabled = true;
  @Input() headerHeight = 25;
  @Input() groupColumnMinWidth = 120;
  @Input() page = 1;
  @Input() pageSize = Grid2Component.DEFAULT_PAGE_SIZE;
  @Input() pagination = true;
  @Input() pageSizes = Array.from(new Set([this.pageSize, 100, 250, 500, 1000]))
    .sort((x, y) => x > y ? 1 : -1);
  // NOTE: remote by default, if you need local sorting => change to `false`
  @Input() remoteSorting = true;
  @Input() rowCount = 0;
  @Input() rowHeight = 25;
  @Input() rows: any[] = [];
  @Input() rowSelection = 'multiple';
  // selected rows
  @Input() selected: any[] = [];
  @Input() persistenceKey: string;
  @Input() showDndGroupPanel = false;
  @Input() styles: CSSStyleDeclaration;

  @Output() onDragStarted: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onDragStopped: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnGroup: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilter: EventEmitter<FilterObject> = new EventEmitter<FilterObject>();
  @Output() onPage: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onPageSize: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onSort: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onSelect: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();

  columnDefs: ColDef[];
  paginationPanel: IToolbarAction[] = [];
  gridOptions: GridOptions = {};

  private gridSettings: IAGridSettings;
  private initialized = false;
  private langSubscription: EventEmitter<any>;
  private viewportDatasource: ViewPortDatasource;

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private notificationService: NotificationsService,
    private translate: TranslateService,
    private valueConverter: ValueConverterService,
  ) {}

  get allColumns(): Column[] {
    return this.gridOptions.columnApi.getAllGridColumns();
  }

  ngOnInit(): void {
    this.viewportDatasource = new ViewPortDatasource(this);
    if (!this.persistenceKey) {
      console.warn('Please provide the [persistenceKey] or the grid will not be able to save its settings');
    }
    const { colDefs } = this.restoreGridSettings();
    this.columnDefs = this.setColumnDefs(colDefs);
    this.setGridOptions();
    this.setPagination();

    const translationKeys = ['grid.messages'];

    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }
    this.translate.get(translationKeys)
      .take(1)
      .subscribe(
        (translation) => {
          if (this.columnTranslationKey) {
            this.translateColumns(translation[this.columnTranslationKey].grid);
          }
        },
        // TODO(d.maltsev): make sure `error` is a string
        error => this.notificationService.warning(error).noAlert().dispatch()
      );

    this.langSubscription = this.translate.onLangChange
      .subscribe((translations: { translations: { [index: string]: string } }) =>
        this.refreshTranslations(translations.translations));

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      const { rowCount, rows, currentPage, currentPageSize, selected } = changes;
      if (rows || currentPage || currentPageSize) {
        this.refreshPagination();
        this.clearRangeSelections();
      }
      if (rowCount) {
        this.viewportDatasource.params.setRowCount(rowCount.currentValue);
        this.refreshRowCount();
      }
      if (rows) {
        this.viewportDatasource.params.setRowData(this.rows);
      }
      if (selected) {
        this.refreshRowCount();
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
        this.onPage.emit({ type: Grid2Component.PREVIOUS_PAGE, payload: this.page });
        break;
      case ToolbarActionTypeEnum.GO_FORWARD:
        if (this.page === this.getPageCount()) {
          this.notificationService.info(`No more data can be loaded`).noAlert().dispatch();
          return;
        }
        this.onPage.emit({ type: Grid2Component.NEXT_PAGE, payload: this.page });
        break;
      case ToolbarActionTypeEnum.GO_FIRST:
        this.onPage.emit({ type: Grid2Component.FIRST_PAGE });
        break;
      case ToolbarActionTypeEnum.GO_LAST:
        this.onPage.emit({ type: Grid2Component.LAST_PAGE, payload: this.getPageCount() });
        break;
    }
  }

  onPageSizeChange(payload: IToolbarActionSelect): void {
    this.onPageSize.emit({ type: Grid2Component.PAGE_SIZE, payload: payload.value[0].value });
  }

  dragStarted(): void {
    // does nothing, for debugging only
    this.onDragStarted.emit({ type: Grid2Component.MOVING_COLUMN });
  }

  dragStopped(): void {
    this.onDragStopped.emit({ type: Grid2Component.MOVING_COLUMN });
  }

  onSelectionChanged(): void {
    const selected = this.gridOptions.api.getSelectedRows();
    this.onSelect.emit({
      type: Grid2Component.SELECTED_ROWS, payload: selected.map(row => row.id)
    });
  }

  rowDoubleClicked(): void {
    this.onDblClick.emit(this.selected.map(node => node.data));
  }

  onFilterChanged(): void {
    const filters = this.getFilters();
    this.onFilter.emit(filters);
  }

  getFilters(): FilterObject {
    const filterModel = this.gridOptions.api.getFilterModel();
    const filters = Object.keys(filterModel)
      .map(key => {
        const filter: any = { name: key };
        const model = filterModel[key];
        // NOTE: `set` filter doesn't return the `filterType` => WTF?
        switch (model.filterType || 'set') {
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
          default:
            filter.operator = 'LIKE';
            filter.values = [`%${model}%`];
            break;
        }
        return filter;
      });

    return FilterObject
      .create()
      .and()
      .addFilters(filters);
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

  onSortChanged(): void {
    this.calculateGridSettings();
    const sorters: IAGridSortModel[] = this.getSorters();
    this.onSort.emit({ type: Grid2Component.SORTING_DIRECTION, payload: sorters });
  }

  getSorters(): any {
    return this.gridOptions.api.getSortModel();
  }

  getExportableColumns(): IGrid2ExportableColumn[] {
    return this.allColumns
      .filter(column => column.isVisible())
      .map(column => {
        const { field, headerName: name } = column.getColDef();
        return { field, name };
      });
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

    if (this.columnTranslationKey) {
      // NOTE: the key 'grid' should be present in translation files for every grid component
      // or this will throw
      const columnTranslations = this.columnTranslationKey
        .split('.')
        .reduce((acc, prop) => acc[prop], translations)
        .grid;
      this.translateColumns(columnTranslations);
    }

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

  private getColumnByName(field: string): IAGridColumn {
    return this.columns.find(column => column.colId === field);
  }

  private getRendererByName(field: string): Function {
    return this.getColumnByName(field).renderer;
  }

  private translateColumns(columnTranslations: object): void {
    this.columnDefs = this.columnDefs.map(col => {
      col.headerName = columnTranslations[col.field];
      return col;
    });
  }

  private getPageCount(): number {
    return Math.ceil(this.rowCount / this.pageSize);
  }

  private getCustomFilter(name: string): any {
    const filterMap = {
      number: 'number',
      text: 'text',
      date: 'date',
      'set': 'set',
      textFilter: GridTextFilter,
    };
    return R.propOr('text', name)(filterMap);
  }

  private getCustomFilterParams(column: IAGridColumn): any {
    if (column.filter === 'set' && column.filterValues) {
      return {
        values: column.filterValues.map(item => item.name),
        cellRenderer: (node: { value: string }) => node.value,
        suppressMiniFilter: true,
        apply: true,
      };
    }
    return {};
  }

  private setColumnDefs(colDefs: ColDef[]): ColDef[] {
    return this.columns.map(column => {
      // need indices to sort the columns
      let index;
      const colDef: ColDef = {
        colId: column.colId,
        field: column.colId,
        filter: this.getCustomFilter(column.filter),
        filterParams: this.getCustomFilterParams(column),
        headerName: column.colId,
        hide: column.hide,
        // maxWidth: column.maxWidth,
        minWidth: column.minWidth,
        width: column.width || column.minWidth,
      };
      // Merge persisted column settings, if any
      if (colDefs) {
        index = colDefs.findIndex(col => col.colId === column.colId);
        // tslint:disable-next-line:no-bitwise
        if (!!~index) {
          Object.assign(colDef, colDefs[index]);
        }
      } else {
        index = -1;
      }

      switch (column.type) {
        case 'primary':
          colDef.cellClass = 'ag-cell-number';
          break;
        case 'date':
          colDef.floatingFilterComponentParams = { suppressFilterButton: true };
          colDef.suppressSizeToFit = true;
          break;
      }
      if (column.renderer) {
        colDef.cellRenderer = (params: ICellRendererParams) => params.data && column.renderer(params.data);
        colDef.valueGetter = colDef.cellRenderer;
      }
      if (column.filter === 'set') {
        colDef.keyCreator = (params) => params.value.code;
      }
      return { column: colDef, index };
    })
    .filter(item => item.index !== -1)
    .sort((a, b) => {
      return a.index > b.index ? 1 : -1;
    })
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
        icons: {
          sortAscending: '<i class="fa fa-sort-amount-asc"/>',
          sortDescending: '<i class="fa fa-sort-amount-desc"/>'
        },
        /* to set the menu tabs for a column */
        // menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        suppressMenu: true,
      },
      enableColResize: true,
      enableRangeSelection: true,
      enableServerSideFilter: true,
      enableServerSideSorting: true,
      floatingFilter: true,
      getMainMenuItems: (params) => {
        // hide the tool menu
        return params.defaultItems.slice(0, params.defaultItems.length - 1);
      },
      headerHeight: this.headerHeight,
      // NOTE: There is a huge translation under `localeText` pulled from *.json
      localeText: {},
      overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">This is a custom \'no rows\' overlay</span>',
      pagination: this.pagination,
      paginationAutoPageSize: false,
      paginationPageSize: this.pageSize,
      /**
       * Reposition the popup to appear right below the button
       * https://www.ag-grid.com/javascript-grid-column-menu/#gsc.tab=0
       */
      postProcessPopup: this.postProcessPopup,
      rowDeselection: true,
      rowGroupPanelShow: this.showDndGroupPanel ? 'always' : '',
      rowHeight: this.rowHeight,
      rowModelType: 'viewport',
      viewportDatasource: this.viewportDatasource,
      getRowNodeId: (row) => { return row.id; },
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
      isExternalFilterPresent: () => this.filterEnabled,
      doesExternalFilterPass: (node: RowNode) => true,
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event),
      onFilterChanged: this.onFilterChanged.bind(this),
      onGridReady: () => this.setSortModel(),
      // onGridSizeChanged: (params) => this.fitGridSize(),
      onColumnResized: () => this.calculateGridSettings(),
      onColumnVisible: () => this.calculateGridSettings(),
      onColumnMoved: () => this.calculateGridSettings(),
      onSelectionChanged: this.onSelectionChanged.bind(this),
      onSortChanged: this.onSortChanged.bind(this),
    };

    this.translateOptionsMessages();
  }

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

  private fitGridSize(): void {
    const gridPanel = this.gridOptions.api['gridPanel'];
    const availableWidth: number = gridPanel.getWidthForSizeColsToFit();
    if (availableWidth > 0) {
      // Prevent horizontal scrollbar
      // Ag-grid workaround. The official examples have the same issue
      gridPanel.columnController.sizeColumnsToFit(availableWidth - gridPanel.scrollWidth * 2);
    }
  }

  private onColumnRowGroupChanged(event: ColumnChangeEvent): void {
    this.fitGridSize();
    this.onColumnGroup.emit({
      type: Grid2Component.GROUPING_COLUMNS, payload: event.getColumns().map(column => column.getColId())
    });
  }

  private calculateGridSettings(): void {
    const sortModel = this.gridOptions.api.getSortModel();
    const colDefs: ColDef[] = this.allColumns.map(column => (
      { width: column.getActualWidth(), hide: !column.isVisible(), colId: column.getColId() }
    ));
    this.gridSettings = { sortModel, colDefs };
  }

  private saveGridSettings(): void {
    if (this.persistenceKey) {
      localStorage.setItem(this.persistenceKey, JSON.stringify(this.gridSettings));
    }
  }

  private restoreGridSettings(): IAGridSettings {
    this.gridSettings = JSON.parse(localStorage.getItem(this.persistenceKey) || '{}');
    return this.gridSettings;
  }

  private setSortModel(): void {
    const { sortModel } = this.gridSettings || this.restoreGridSettings();
    this.gridOptions.api.setSortModel(sortModel);
  }
}
