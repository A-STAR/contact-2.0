import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import * as R from 'ramda';
import { TranslateService } from '@ngx-translate/core';
import {
  ColDef,
  ICellRendererParams,
  GridOptions,
  RowNode,
  Column,
  ColumnChangeEvent,
} from 'ag-grid';
import { FilterObject } from './filter/grid2-filter';
import { GridTextFilter } from './filter/text-filter';

import {
  IToolbarAction,
  IToolbarActionSelectPayload,
  ToolbarActionTypeEnum,
  ToolbarControlEnum
} from '../toolbar/toolbar.interface';
import {
  IGrid2ColumnsPositionsChangePayload,
  Grid2SortingEnum,
  IGrid2EventPayload,
  IGrid2ColumnsSettings,
  IGrid2HeaderParams,
  IGrid2ServiceDispatcher,
  IGrid2SortingDirectionSwitchPayload,
  IGrid2ColumnSettings,
} from './grid2.interface';
import { IGridColumn } from '../grid/grid.interface';

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
export class Grid2Component implements OnInit, OnChanges, OnDestroy, IGrid2ServiceDispatcher {
  static DEFAULT_PAGE_SIZE = 250;

  static NEXT_PAGE = 'GRID2_NEXT_PAGE';
  static PREVIOUS_PAGE = 'GRID2_PREVIOUS_PAGE';
  static PAGE_SIZE = 'GRID2_PAGE_SIZE';
  static SORTING_DIRECTION = 'GRID2_SORTING_DIRECTION';
  static COLUMNS_POSITIONS = 'GRID2_COLUMNS_POSITIONS';
  static GROUPING_COLUMNS = 'GRID2_GROUPING_COLUMNS';
  static SELECTED_ROWS = 'GRID2_SELECTED_ROWS';
  static OPEN_FILTER = 'GRID2_OPEN_FILTER';
  static CLOSE_FILTER = 'GRID2_CLOSE_FILTER';
  static APPLY_FILTER = 'GRID2_APPLY_FILTER';
  static MOVING_COLUMN = 'GRID2_MOVING_COLUMN';
  static DESTROY_STATE = 'GRID2_DESTROY_STATE';

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
  @Input() showDndGroupPanel = true;
  @Input() showFooter = true;

  // Inputs without presets
  @Input() columnsSettings = null as IGrid2ColumnsSettings;
  @Input() filterColumn: Column;
  @Input() columnMovingInProgress: boolean;
  @Input() columnTranslationKey: string;
  @Input() rows: any[];
  @Input() rowsTotalCount: number;
  @Input() selectedRows: any[] = [];
  @Input() styles: CSSStyleDeclaration;
  @Input() toolbarActions: IToolbarAction[];

  // Outputs
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onColumnMoved: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnMoving: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnsPositions: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onGroupingColumns: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onFilter: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onPage: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onPageSize: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onSort: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onRowsSelect: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();

  gridToolbarActions: IToolbarAction[];
  columnDefs: ColDef[] = [];
  gridOptions: GridOptions = {};

  private langSubscription: EventEmitter<any>;
  private rowsCounterElement: IToolbarAction;
  private backwardElement: IToolbarAction;
  private forwardElement: IToolbarAction;
  private pageElement: IToolbarAction;
  private pagesSizeElement: IToolbarAction;
  private initialized = false;
  @Input() filter(record: any): boolean { return record; }

  constructor(
    private renderer2: Renderer2,
    private translate: TranslateService,
    private elRef: ElementRef,
  ) { }

  get gridRows(): any[] {
    // TODO https://github.com/ceolter/ag-grid/issues/524
    return this.rows && this.rows.length ? this.rows : null;
  }

  get hasToolbar(): boolean {
    return !!this.toolbarActions;
  }

  get filterField(): string {
    return this.filterColumn && this.filterColumn.getColDef().field;
  }

  get filterColumnName(): string {
    return this.filterColumn.getColDef().headerName;
  }

  get filterObject(): FilterObject {
    const columnSettings: IGrid2ColumnSettings = this.columnsSettings[this.filterField];
    return columnSettings ? columnSettings.filter : null;
  }

  get allGridColumns(): Column[] {
    return this.gridOptions.columnApi.getAllGridColumns();
  }

  get isMultipleRowSelection(): boolean {
    return this.rowSelection === 'multiple';
  }

  ngOnInit(): void {
    this.setGridOptions();
    this.createColumnDefs();
    this.defineGridToolbarActions();

    const gridMessagesKey = 'grid.messages';
    const translationKeys = [gridMessagesKey];

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
        // TODO: log out the error
        error => console.error(error)
      );

    this.langSubscription = this.translate.onLangChange
      .subscribe((translations: { translations: { [index: string]: string } }) =>
        this.refreshTranslations(translations.translations));

    this.refreshRowsInfo();

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      if (R.prop('rows', changes) || R.prop('currentPage', changes) || R.prop('currentPageSize', changes)) {
        this.refreshRowsInfo();
        this.refreshPaginationElements();
        this.clearAllSelections();
      }
      if (R.prop('selectedRows', changes)) {
        this.refreshRowsInfo();
      }
      if (R.prop('columnsSettings', changes)) {
        if (this.remoteSorting) {
          this.applyClientSorting();
        }
      }
      // if (R.prop('columnsSettings', changes) || R.prop('columnMovingInProgress', changes)) {
      // }
    }
  }

  ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
    this.columnDefs.forEach(column => {
      if (column.filter) {
        // const filter = this.gridOptions.api.getFilterInstance(column.headerName);
        // filter.destroy();
      }
    });
  }

  onSelect(event: any): void {
    const rowNode: RowNode = event.node;
    this.onRowsSelect.emit({
      type: Grid2Component.SELECTED_ROWS, payload: { rowData: rowNode.data, selected: rowNode.isSelected() }
    });
  }

  private refreshRowsInfo(): void {
    if (!this.rowsCounterElement) {
      return;
    }
    this.rowsCounterElement.text = this.translate.instant('default.grid.selectedCounts', {
      length: this.getRowsTotalCount(),
      selected: this.selectedRows.length
    });
  }

  private refreshPaginationElements(): void {
    // const paginationElementsVisible: boolean = this.rows.length < this.rowsTotalCount;
    const canPaginate: boolean = this.getRowsTotalCount() > this.pageSize;

    if (this.pagination) {
      const pageCount = this.getPageCount();
      [this.backwardElement, this.forwardElement, this.pageElement]
        .forEach((action: IToolbarAction) => action.disabled = !canPaginate);

      // this.pagesSizeElement.visible = true;
      // this.backwardElement.visible = this.page > 1 && paginationElementsVisible;
      // this.forwardElement.visible = this.page < pageCount && paginationElementsVisible;
      // this.pageElement.visible = true;

      this.pageElement.text = `${this.page}/${pageCount || 0}`;
      this.gridOptions.api.doLayout();
      console.log(this.pageElement.text);
    }
  }

  private refreshTranslations(translations: { [index: string]: any }): void {
    this.refreshRowsInfo();

    this.translateGridOptionsMessages();
    this.gridOptions.groupColumnDef.headerName = this.translate.instant('default.grid.groupColumn');

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

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  onRowDoubleClicked(): void {
    this.onDblClick.emit(this.selectedRows.map(rowNode => rowNode.data));
  }

  onDragStarted(): void {
    this.onColumnMoving.emit({ type: Grid2Component.MOVING_COLUMN, payload: {movingColumnInProgress: true} });
  }

  onDragStopped(): void {
    this.onColumnMoved.emit({ type: Grid2Component.MOVING_COLUMN, payload: {movingColumnInProgress: false} });

    this.dispatchColumnsPositions({
      columnsPositions: this.allGridColumns.map((column: Column) => column.getColDef().field)
    });
  }

  saveFilterChanges(filter: FilterObject): void {
    this.onFilter.emit({ type: Grid2Component.APPLY_FILTER, payload: {
      columnId: this.filterField,
      filter: filter
    }});

  }

  onToolbarActionClick(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.BACKWARD:
        this.onPage.emit({ type: Grid2Component.PREVIOUS_PAGE, payload: this.page });
        break;
      case ToolbarActionTypeEnum.FORWARD:
        this.onPage.emit({ type: Grid2Component.NEXT_PAGE, payload: this.page });
        break;
    }
  }

  onToolbarActionSelect(payload: IToolbarActionSelectPayload): void {
    this.onPageSize.emit({ type: Grid2Component.PAGE_SIZE, payload: payload.value[0].value });
  }

  dispatchSortingDirection(payload: IGrid2SortingDirectionSwitchPayload): void {
    this.onSort.emit({ type: Grid2Component.SORTING_DIRECTION, payload: payload });
  }

  dispatchColumnsPositions(payload: IGrid2ColumnsPositionsChangePayload): void {
    this.onColumnsPositions.emit({ type: Grid2Component.COLUMNS_POSITIONS, payload: payload });
  }

  private changeSortingDirection(direction: Grid2SortingEnum): Grid2SortingEnum {
    const nextDirection = direction + 1;
    return nextDirection > 2 ? 0 : nextDirection;
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

  private getRowsTotalCount(): number {
    return Math.max(this.rows.length, this.rowsTotalCount || 0);
  }

  private getPageCount(): number {
    return Math.ceil(this.getRowsTotalCount() / this.pageSize);
  }

  private applyClientSorting(): void {
    const sortModel = this.allGridColumns.map(column => {
      const columnId: string = column.getColDef().field;
      return this.columnsSettings[columnId]
        ? {
          colId: columnId,
          sort: this.columnsSettings[columnId].sortingDirection,
        } : null;
    }).filter(item => !!item);

    if (sortModel.length) {
      this.gridOptions.api.setSortModel(sortModel);
    }
  }

  private defineGridToolbarActions(): void {
    if (!this.showFooter) {
      return;
    }
    this.gridToolbarActions = [
      this.rowsCounterElement = { control: ToolbarControlEnum.LABEL },
    ];
    if (this.pagination) {
      this.gridToolbarActions.push(this.backwardElement = { type: ToolbarActionTypeEnum.BACKWARD, visible: true });
      this.gridToolbarActions.push(this.pageElement = { control: ToolbarControlEnum.LABEL, visible: true });
      this.gridToolbarActions.push(this.forwardElement = { type: ToolbarActionTypeEnum.FORWARD, visible: true });
      this.gridToolbarActions.push(this.pagesSizeElement = {
        control: ToolbarControlEnum.SELECT,
        value: this.pageSizes.map(pageSize => ({ value: pageSize })),
        activeValue: Grid2Component.DEFAULT_PAGE_SIZE,
        disabled: false,
        styles: { width: '100px' }
      });
    }
  }

  private getCustomFilter(name: string): any {
    const filterMap = {
      text: 'text',
      date: 'date',
      'set': 'set',
      textFilter: GridTextFilter,
    };
    return R.propOr('text', name)(filterMap);
  }

  private createColumnDefs(): void {
    this.columnDefs = this.columns.map(column => {
      const colDef: ColDef = {
        field: column.prop,
        filter: this.getCustomFilter(column.filter),
        headerName: column.prop,
        /* to set the menu tabs for a column */
        // menuTabs:['filterMenuTab','generalMenuTab','columnsMenuTab'],
        maxWidth: column.maxWidth,
        minWidth: column.minWidth,
        suppressSizeToFit: column.suppressSizeToFit,
        // suppressFilter: !column.filter,
        // suppressMenu: !!column.suppressMenu,
        suppressMenu: true,
        width: column.width || column.minWidth,
      };
      if (column.renderer) {
        colDef.cellRenderer = (params: ICellRendererParams) => params.data && column.renderer(params.data);
        colDef.valueGetter = colDef.cellRenderer;
      }
      return colDef;
    });
  }

  private setGridOptions(): void {
    this.gridOptions = {
      defaultColDef: {
        enableRowGroup: true,
        headerComponentParams: {
          headerHeight: this.headerHeight,
          enableMenu: false,
          serviceDispatcher: this,
          renderer2: this.renderer2
        } as IGrid2HeaderParams
      },
      enableFilter: true,
      enableSorting: true,
      floatingFilter: true,
      getMainMenuItems: (params) => {
        // hide the tool menu
        const menuItems = params.defaultItems.slice(0, params.defaultItems.length - 1);
        return menuItems;
      },
      groupColumnDef: {
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
      localeText: {
        noRowsToShow : this.translate.instant('default.grid.empty'),
        rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle'),
      },
      overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">This is a custom \'no rows\' overlay</span>',
      // https://www.ag-grid.com/javascript-grid-column-menu/#gsc.tab=0
      postProcessPopup: (params) => {
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
      },
      rowGroupPanelShow: this.showDndGroupPanel ? 'always' : '',
      suppressMenuMainPanel: true,
      suppressRowHoverClass: true,
      toolPanelSuppressRowGroups: true,
      toolPanelSuppressValues: true,
      toolPanelSuppressPivots: true,
      toolPanelSuppressPivotMode: true,
      isExternalFilterPresent: () => this.filterEnabled,
      doesExternalFilterPass: (node: RowNode) => this.filter(node.data),
      onGridReady: () => this.onColumnEverythingChanged(),
      onGridSizeChanged: (params) => this.fitGridSize(),
      onColumnEverythingChanged: () => this.onColumnEverythingChanged(),
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event),
      // onFilterChanged: (p) => { console.log('onFilterChanged', p); },
      // onFilterModified: (p) => { console.log('onFilterModified', p); },
    };

    this.translateGridOptionsMessages();
  }

  private onColumnEverythingChanged(): void {
    this.fitGridSize();
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

    this.onGroupingColumns.emit({
      type: Grid2Component.GROUPING_COLUMNS, payload: {
        groupingColumns: event.getColumns().map(column => column.getColId())
      }
    });
  }
}
