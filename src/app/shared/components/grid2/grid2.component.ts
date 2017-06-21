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

import {
  IToolbarAction,
  IToolbarActionSelectPayload,
  ToolbarActionTypeEnum,
  ToolbarControlEnum
} from '../toolbar/toolbar.interface';
import {
  IGrid2ColumnsPositionsChangePayload,
  IGrid2ShowFilterPayload,
  Grid2SortingEnum,
  IGrid2EventPayload,
  IGrid2ColumnsSettings,
  IGrid2HeaderParams,
  IGrid2ServiceDispatcher,
  IGrid2SortingDirectionSwitchPayload,
  IGrid2ColumnSettings,
} from './grid2.interface';
import { IGridColumn } from '../grid/grid.interface';
import { ControlTypes } from '../form/dynamic-form/dynamic-form-control.interface';
import { FilterObject } from './filter/grid2-filter';

import { GridHeaderComponent } from './header/grid-header.component';

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./grid2.component.scss', './grid2.component.ag-base.css', './grid2.component.theme-contact2.css'],
})
export class Grid2Component implements OnInit, OnChanges, OnDestroy, IGrid2ServiceDispatcher {
  static DEFAULT_PAGE_SIZE = 50;

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
  @Input() selectedRows: any[] = [];
  @Input() page = 1;
  @Input() pageSize = Grid2Component.DEFAULT_PAGE_SIZE;
  @Input() headerHeight = 30;
  @Input() rowHeight = 25;
  @Input() groupColumnMinWidth = 120;
  @Input() showDndGroupPanel = true;
  @Input() remoteSorting = false;
  @Input() footerPresent = true;
  @Input() pagination = false;
  @Input() rowSelection = 'multiple';
  @Input() pageSizes =  Array.from(new Set([Grid2Component.DEFAULT_PAGE_SIZE, 100, 250, 500, 1000]));

  // Inputs without presets
  @Input() columnsSettings = null as IGrid2ColumnsSettings;
  @Input() filterColumn: Column;
  @Input() columnMovingInProgress: boolean;
  @Input() columnTranslationKey: string;
  @Input() filterEnabled = true;
  @Input() rows: any[];
  @Input() rowsTotalCount: number;
  @Input() styles: CSSStyleDeclaration;
  @Input() toolbarActions: IToolbarAction[];

  // Outputs
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onNextPage: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onPreviousPage: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onPageSize: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnsPositions: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnMoving: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onColumnMoved: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onOpenFilter: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onApplyFilter: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onCloseFilter: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onGroupingColumns: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onSortingDirection: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();
  @Output() onRowsSelect: EventEmitter<IGrid2EventPayload> = new EventEmitter<IGrid2EventPayload>();

  gridToolbarActions: IToolbarAction[];
  columnDefs: ColDef[] = [];
  gridOptions: GridOptions = {};

  private langSubscription: EventEmitter<any>;
  private headerColumns: GridHeaderComponent[] = [];
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
  ) {
  }

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

  get filterControlType(): ControlTypes {
    return this.getSimpleColumnByName(this.filterField).filterControlType;
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
        if (!this.remoteSorting) {
          this.applyClientSorting();
        }
      }
      if (R.prop('columnsSettings', changes) || R.prop('columnMovingInProgress', changes)) {
        this.refreshHeaderColumns();
      }
    }
  }

  ngOnDestroy(): void {
    this.headerColumns = null;
    this.langSubscription.unsubscribe();
  }

  onSelect(event: any): void {
    const rowNode: RowNode = event.node;
    this.onRowsSelect.emit({
      type: Grid2Component.SELECTED_ROWS, payload: { rowData: rowNode.data, selected: rowNode.isSelected() }
    });
  }

  private refreshHeaderColumns(): void {
    this.headerColumns.forEach((gridHeaderComponent: GridHeaderComponent) => {
      gridHeaderComponent.refreshView(this.columnsSettings);
      gridHeaderComponent.freeze(this.columnMovingInProgress);
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
    const paginationElementsVisible: boolean = this.rows.length < this.rowsTotalCount;
    const isPaginationElementsExist: boolean = this.getRowsTotalCount() > this.pageSize;

    if (this.pagination) {
      const pagesCount: number = this.getPagesCount();
      [this.backwardElement, this.forwardElement, this.pageElement]
        .forEach((action: IToolbarAction) => action.noRender = !isPaginationElementsExist);
      this.pagesSizeElement.noRender = false;

      this.pagesSizeElement.visible = true;
      this.backwardElement.visible = this.page > 1 && paginationElementsVisible;
      this.forwardElement.visible = this.page < pagesCount && paginationElementsVisible;
      this.pageElement.visible = true;

      this.pageElement.text = `${this.page}/${pagesCount}`;
    }
  }

  private refreshTranslations(translations: { [index: string]: any }): void {
    this.refreshRowsInfo();

    this.gridOptions.localeText.rowGroupColumnsEmptyMessage = this.translate.instant('default.grid.groupDndTitle');
    this.gridOptions.groupColumnDef.headerName = this.translate.instant('default.grid.groupColumn');

    // translate column names
    if (this.columnTranslationKey) {
      // IMPORTANT: the key 'grid' should be present in translation files for every grid component
      const columnTranslations = this.columnTranslationKey.split('.').reduce((acc, prop) => acc[prop], translations).grid;
      this.translateColumns(columnTranslations);
    }
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
    this.onApplyFilter.emit({ type: Grid2Component.APPLY_FILTER, payload: {
      columnId: this.filterField,
      filter: filter
    }});

    this.dispatchCloseFilter();
  }

  closeFilter(): void {
    this.dispatchCloseFilter();
  }

  onToolbarActionClick(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.BACKWARD:
        this.onPreviousPage.emit({ type: Grid2Component.PREVIOUS_PAGE, payload: this.page });
        break;
      case ToolbarActionTypeEnum.FORWARD:
        this.onNextPage.emit({ type: Grid2Component.NEXT_PAGE, payload: this.page });
        break;
    }
  }

  onToolbarActionSelect(payload: IToolbarActionSelectPayload): void {
    this.onPageSize.emit({ type: Grid2Component.PAGE_SIZE, payload: payload.value.value });
  }

  dispatchSortingDirection(payload: IGrid2SortingDirectionSwitchPayload): void {
    this.onSortingDirection.emit({ type: Grid2Component.SORTING_DIRECTION, payload: payload });
  }

  dispatchColumnsPositions(payload: IGrid2ColumnsPositionsChangePayload): void {
    this.onColumnsPositions.emit({ type: Grid2Component.COLUMNS_POSITIONS, payload: payload });
  }

  dispatchShowFilter(payload: IGrid2ShowFilterPayload): void {
    this.onOpenFilter.emit({ type: Grid2Component.OPEN_FILTER, payload: payload });
  }

  dispatchCloseFilter(): void {
    this.onCloseFilter.emit({type: Grid2Component.CLOSE_FILTER});
  }

  private getSimpleColumnByName(field: string): IGridColumn {
    return this.columns.find((column: IGridColumn) => column.prop === field);
  }

  private getValueGetterByName(field: string): Function {
    return this.getSimpleColumnByName(field).$$valueGetter;
  }

  private translateColumns(columnTranslations: object): void {
    this.columnDefs = this.columnDefs.map((col: ColDef) => {
      col.headerName = columnTranslations[col.field];
      return col;
    });
  }

  private getRowsTotalCount(): number {
    return Math.max(this.rows.length, this.rowsTotalCount || 0);
  }

  private getPagesCount(): number {
    return Math.ceil(this.getRowsTotalCount() / this.pageSize);
  }

  private applyClientSorting(): void {
    const sortModel = this.allGridColumns.map((column: Column) => {
      const columnId: string = column.getColDef().field;
      return this.columnsSettings[columnId]
        ? {
          colId: columnId,
          sort: this.columnsSettings[columnId].sortingDirection === Grid2SortingEnum.ASC ? Column.SORT_ASC : Column.SORT_DESC
        } : null;
    }).filter(item => !!item);

    if (sortModel.length) {
      this.gridOptions.api.setSortModel(sortModel);
    }
  }

  private defineGridToolbarActions(): void {
    if (!this.footerPresent) {
      return;
    }
    this.gridToolbarActions = [
      this.rowsCounterElement = { control: ToolbarControlEnum.LABEL },
    ];
    if (this.pagination) {
      this.gridToolbarActions.push(this.backwardElement = { type: ToolbarActionTypeEnum.BACKWARD, noRender: true });
      this.gridToolbarActions.push(this.pageElement = { control: ToolbarControlEnum.LABEL, noRender: true });
      this.gridToolbarActions.push(this.forwardElement = { type: ToolbarActionTypeEnum.FORWARD, noRender: true });
      this.gridToolbarActions.push(this.pagesSizeElement = {
        control: ToolbarControlEnum.SELECT,
        value: this.pageSizes.map((pageSize: number) => { return { value: pageSize }; }),
        activeValue: Grid2Component.DEFAULT_PAGE_SIZE,
        noRender: true,
        styles: { width: '100px' }
      });
    }
  }

  private createColumnDefs(): void {
    this.columnDefs = this.columns.map<ColDef>((column: IGridColumn) => {
      const colDef: ColDef = {
        field: column.prop,
        headerName: column.prop,
        headerComponent: GridHeaderComponent,
        suppressSizeToFit: column.suppressSizeToFit,
        maxWidth: column.maxWidth,
        minWidth: column.minWidth,
        width: column.width || column.minWidth
      };
      if (column.$$valueGetter) {
        colDef.cellRenderer = (params: ICellRendererParams) => params.data && column.$$valueGetter(params.data);
      }
      return colDef;
    });
  }

  private setGridOptions(): void {
    this.gridOptions = {
      localeText: {
        rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle'),
      },
      rowGroupPanelShow: this.showDndGroupPanel ? 'always' : '',
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
            const groupField: string = rowNode.field;
            if (rowNode.group && rowNode.allLeafChildren.length) {
              const $$valueGetter: Function = this.getValueGetterByName(rowNode.field);
              const recordData = rowNode.allLeafChildren[0].data;
              return $$valueGetter
                ? $$valueGetter(recordData)
                : (recordData[groupField] || rowNode.rowGroupColumn.getColDef().headerName);
            }
            return '';
          },
        }
      },
      defaultColDef: {
        enableRowGroup: true,
        headerComponentParams: {
          headerHeight: this.headerHeight,
          enableMenu: true,
          serviceDispatcher: this,
          headerColumns: this.headerColumns,
          renderer2: this.renderer2
        } as IGrid2HeaderParams
      },
      isExternalFilterPresent: () => this.filterEnabled,
      doesExternalFilterPass: (node: RowNode) => this.filter(node.data),
      onGridReady: () => this.onColumnEverythingChanged(),
      onGridSizeChanged: (params) => this.fitGridSize(),
      onColumnEverythingChanged: () => this.onColumnEverythingChanged(),
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event)
    };
  }

  private onColumnEverythingChanged(): void {
    this.refreshHeaderColumns();
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
        groupingColumns: event.getColumns().map((column: Column) => column.getColId())
      }
    });
  }
}
