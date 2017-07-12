import {
  ChangeDetectionStrategy,
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
  IToolbarActionSelectPayload,
  ToolbarActionTypeEnum,
  ToolbarControlEnum
} from '../toolbar/toolbar.interface';
import { IGrid2ColumnsPositions, IGrid2Sorter, IGrid2EventPayload, IGrid2ExportableColumn } from './grid2.interface';
import { IGridColumn } from '../grid/grid.interface';
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
  static COLUMNS_POSITIONS  = 'GRID2_COLUMNS_POSITIONS';
  static GROUPING_COLUMNS   = 'GRID2_GROUPING_COLUMNS';
  static SELECTED_ROWS      = 'GRID2_SELECTED_ROWS';
  static APPLY_FILTER       = 'GRID2_APPLY_FILTER';
  static MOVING_COLUMN      = 'GRID2_MOVING_COLUMN';
  static DESTROY_STATE      = 'GRID2_DESTROY_STATE';

  // Inputs with presets
  @Input() columns: IGridColumn[] = [];
  @Input() filterEnabled = true;
  @Input() headerHeight = 25;
  @Input() groupColumnMinWidth = 120;
  @Input() page = 1;
  @Input() pageSize = Grid2Component.DEFAULT_PAGE_SIZE;
  @Input() pagination = true;
  @Input() pageSizes = Array.from(new Set([this.pageSize, 100, 250, 500, 1000]))
    .sort((x, y) => x > y ? 1 : -1);
  // NOTE: need this to override the default functionality
  @Input() remoteSorting = true;
  @Input() rowHeight = 25;
  @Input() rowSelection = 'multiple';
  @Input() showDndGroupPanel = false;

  // Inputs without presets
  @Input() sorters = null as IGrid2Sorter[];
  @Input() filterColumn: Column;
  @Input() columnTranslationKey: string;
  @Input() rows: any[];
  @Input() rowCount = 0;
  @Input() selected: any[] = [];
  @Input() styles: CSSStyleDeclaration;

  // Outputs
  @Output() onDragStopped: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onDragStarted: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnsPositions: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
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

  private langSubscription: EventEmitter<any>;
  private initialized = false;
  private viewportDatasource: ViewPortDatasource;

  constructor(
    private elRef: ElementRef,
    private notificationService: NotificationsService,
    private translate: TranslateService,
    private valueConverter: ValueConverterService,
  ) {}

  get gridRows(): any[] {
    return this.rows || null;
  }

  get allGridColumns(): Column[] {
    return this.gridOptions.columnApi.getAllGridColumns();
  }

  ngOnInit(): void {
    this.viewportDatasource = new ViewPortDatasource(this);
    this.columnDefs = this.setColumnDefs();
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
        error => this.notificationService.warning(error, false)
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
        this.clearAllSelections();
      }
      if (rowCount) {
        this.viewportDatasource.params.setRowCount(rowCount.currentValue);
        this.refreshRowCount();
      }
      if (rows) {
        this.viewportDatasource.params.setRowData(this.gridRows);
      }
      if (selected) {
        this.refreshRowCount();
      }
      // if (R.prop('sorters', changes)) {
      //   if (this.remoteSorting) {
      //     this.applyClientSorting();
      //   }
      // }
    }
  }

  ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
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
    const count = this.translate.instant(
      'default.grid.selectedCounts',
      { length: this.rowCount, selected: this.selected.length }
    );
    this.paginationPanel = this.paginationPanel.map((btn, i) => {
      if (i === 0) {
        btn.text = count;
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

  onPageChange(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.GO_BACKWARD:
        if (this.page === 1) {
          this.notificationService.info(`Can't fetch page no ${this.page}`, false);
          return;
        }
        this.onPage.emit({ type: Grid2Component.PREVIOUS_PAGE, payload: this.page });
        break;
      case ToolbarActionTypeEnum.GO_FORWARD:
        if (this.page === this.getPageCount()) {
          this.notificationService.info(`No more data can be loaded`, false);
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

  onPageSizeChange(payload: IToolbarActionSelectPayload): void {
    this.onPageSize.emit({ type: Grid2Component.PAGE_SIZE, payload: payload.value[0].value });
  }

  dragStarted(): void {
    // does really nothing, good for debugging
    this.onDragStarted.emit({ type: Grid2Component.MOVING_COLUMN });
  }

  dragStopped(): void {
    this.onDragStopped.emit({ type: Grid2Component.MOVING_COLUMN });
    // TODO(a.tymchuk): this is hacky, to be refactored
    if (this.rowCount) {
      const payload: IGrid2ColumnsPositions = this.allGridColumns.map(column => column.getColDef().field);
      this.onColumnsPositions.emit({ type: Grid2Component.COLUMNS_POSITIONS, payload });
    }
  }

  rowSelected(event: any): void {
    const rowNode: RowNode = event.node;
    this.onSelect.emit({
      type: Grid2Component.SELECTED_ROWS, payload: { rowData: rowNode.data, selected: rowNode.isSelected() }
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
    // console.log('filter model', filterModel);
    const filters = Object.keys(filterModel)
      .map(key => {
        const filter: any = { name: key };
        const el = filterModel[key];
        switch (el.filterType) {
          case 'date':
            filter.operator = 'BETWEEN';
            filter.values = this.valueConverter.makeRangeFromLocalDate(el.dateFrom);
            break;
          case 'text':
            filter.operator = 'LIKE';
            filter.values = [`%${el.filter}%`];
            break;
          case 'number':
            filter.operator = '==';
            filter.values = [Number(el.filter)];
            break;
          default:
            filter.operator = 'LIKE';
            filter.values = [`%${el}%`];
            break;
        }
        return filter;
      });

    return FilterObject
      .create()
      .and()
      .addFilters(filters);
  }

  onSortChanged(): void {
    const sorters = this.getSorters();
    this.onSort.emit({ type: Grid2Component.SORTING_DIRECTION, payload: sorters as IGrid2Sorter[] });
  }

  getSorters(): any {
    return this.gridOptions.api.getSortModel()
      .map(col => {
        return { field: col.colId, direction: col.sort };
      });
  }

  getExportableColumns(): IGrid2ExportableColumn[] {
    return this.allGridColumns
      .filter(column => column.isVisible())
      .map(column => {
        const { field, headerName } = column.getColDef();
        return { field, name: headerName };
      });
  }

  private refreshTranslations(translations: { [index: string]: any }): void {
    this.refreshRowCount();

    this.translateGridOptionsMessages();
    this.gridOptions.autoGroupColumnDef.headerName = this.translate.instant('default.grid.groupColumn');

    // translate column names
    if (this.columnTranslationKey) {
      // IMPORTANT: the key 'grid' should be present in translation files for every grid component
      const columnTranslations = this.columnTranslationKey.split('.').reduce((acc, prop) => acc[prop], translations).grid;
      this.translateColumns(columnTranslations);
    }

    // See ag-grid's BorderLayout
    // Array.from(this.elRef.nativeElement.querySelectorAll('.ag-overlay-wrapper'))
    //   .forEach((el: Element) => el.innerHTML = this.gridOptions.localeText.noRowsToShow);
    // this.gridOptions.api.doLayout();
  }

  private translateGridOptionsMessages(): any {
    return Object.assign(this.gridOptions.localeText || {}, {
      noRowsToShow: this.translate.instant('default.grid.empty'),
      rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle')
    });
  }

  private clearAllSelections(): void {
    this.gridOptions.api.clearRangeSelection();
    this.gridOptions.api.clearFocusedCell();
  }

  private getColumnByName(field: string): IGridColumn {
    return this.columns.find(column => column.prop === field);
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

  private getCustomFilterParams(column: IGridColumn): any {
    if (column.filter === 'date') {
      return {
        filterOptions: [ 'equals', 'notEqual', 'lessThanOrEqual', 'greaterThanOrEqual' ]
      };
    } else if (column.filter === 'set' && column.filterValues) {
      return {
        values: Object.keys(column.filterValues),
        cellRenderer: (node: { value: string }) => column.filterValues[parseInt(node.value, 10)]
      };
    }
    return {};
  }

  private setColumnDefs(): ColDef[] {
    return this.columns.map(column => {
      const colDef: ColDef = {
        colId: column.prop,
        field: column.prop,
        filter: this.getCustomFilter(column.filter),
        filterParams: this.getCustomFilterParams(column),
        headerName: column.prop,
        hide: !!column.hidden,
        /* to set the menu tabs for a column */
        // menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        maxWidth: column.maxWidth,
        minWidth: column.minWidth,
        suppressSizeToFit: column.suppressSizeToFit,
        // suppressFilter: !column.filter,
        // suppressMenu: !!column.suppressMenu,
        suppressMenu: true,
        width: column.width || column.minWidth,
      };
      if (column.type === 'id') {
        colDef.cellClass = 'ag-cell-number';
      }
      if (['id', 'date'].includes(column.type)) {
        colDef.floatingFilterComponentParams = { suppressFilterButton: true };
      }
      if (column.renderer) {
        colDef.cellRenderer = (params: ICellRendererParams) => params.data && column.renderer(params.data);
        colDef.valueGetter = colDef.cellRenderer;
      }
      return colDef;
    });
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
        }
      },
      enableColResize: true,
      // enableFilter: true,
      enableServerSideFilter: true,
      enableServerSideSorting: true,
      floatingFilter: true,
      getMainMenuItems: (params) => {
        // hide the tool menu
        const menuItems = params.defaultItems.slice(0, params.defaultItems.length - 1);
        return menuItems;
      },
      headerHeight: this.headerHeight,
      localeText: {
        noRowsToShow : this.translate.instant('default.grid.empty'),
        rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle'),
      },
      // overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">This is a custom \'no rows\' overlay</span>',
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
      getRowNodeId: (row) => {
        // console.log('get row node id', row.id);
        return row.id;
      },
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
      // onGridReady: () => this.onColumnEverythingChanged(),
      onGridSizeChanged: (params) => this.fitGridSize(),
      onColumnEverythingChanged: () => this.onColumnEverythingChanged(),
      onSortChanged: this.onSortChanged.bind(this),
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event),
      onFilterChanged: this.onFilterChanged.bind(this),
    };

    this.translateGridOptionsMessages();
  }

  private onColumnEverythingChanged(): void {
    this.fitGridSize();
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
      type: Grid2Component.GROUPING_COLUMNS, payload: {
        groupingColumns: event.getColumns().map(column => column.getColId())
      }
    });
  }
}
