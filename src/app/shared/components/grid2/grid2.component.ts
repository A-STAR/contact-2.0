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
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import {
  ColDef,
  ICellRendererParams,
  GridOptions,
  RowNode,
  Column,
  ColumnChangeEvent
} from 'ag-grid';
import { Store } from '@ngrx/store';

import { IToolbarAction, ToolbarControlEnum } from '../toolbar/toolbar.interface';
import { IAppState } from '../../../core/state/state.interface';
import {
  IGrid2ColumnsPositionsChangePayload,
  IGrid2ShowFilterPayload,
  Grid2SortingEnum,
  IGrid2SelectedRowChangePayload
} from './grid2.interface';
import { IGridColumn } from '../grid/grid.interface';
import { IGrid2HeaderParams, IGrid2ServiceDispatcher, IGrid2SortingDirectionSwitchPayload, IGrid2State } from './grid2.interface';

import { GridHeaderComponent } from './header/grid-header.component';

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./grid2.component.scss', './grid2.component.ag-base.css', './grid2.component.theme-contact2.css'],
})
export class Grid2Component implements OnInit, OnChanges, OnDestroy, IGrid2ServiceDispatcher {
  static SORTING_DIRECTION = 'GRID2_SORTING_DIRECTION';
  static COLUMNS_POSITIONS = 'GRID2_COLUMNS_POSITIONS';
  static GROUPING_COLUMNS = 'GRID2_GROUPING_COLUMNS';
  static SELECTED_ROWS = 'GRID2_SELECTED_ROWS';
  static OPEN_FILTER = 'GRID2_OPEN_FILTER';
  static CLOSE_FILTER = 'GRID2_CLOSE_FILTER';
  static MOVING_COLUMN = 'GRID2_MOVING_COLUMN';
  static DESTROY_STATE = 'GRID2_DESTROY_STATE';

  // Inputs with presets
  @Input() headerHeight = 30;
  @Input() rowHeight = 25;
  @Input() groupColumnMinWidth = 120;
  @Input() showDndGroupPanel = true;
  @Input() remoteSorting = false;
  @Input() footerPresent = true;
  @Input() pagination = false;
  @Input() filter(record: any): boolean { return record; }

  // Inputs without presets
  @Input() stateKey: string;
  @Input() columns: IGridColumn[] = [];
  @Input() columnTranslationKey: string;
  @Input() filterEnabled: boolean = true;
  @Input() rows: any[];
  @Input() styles: CSSStyleDeclaration;
  @Input() toolbarActions: IToolbarAction[];
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRowDoubleSelect: EventEmitter<any> = new EventEmitter();

  selected: any[] = [];
  gridToolbarActions: IToolbarAction[];
  columnDefs: ColDef[] = [];
  gridOptions: GridOptions = {};

  // Links to the state
  private statedFilterColumn: Column;

  private langSubscription: EventEmitter<any>;
  private headerColumns: GridHeaderComponent[] = [];
  private rowsCounterElement;
  private stateSubscription: Subscription;

  constructor(
    private renderer2: Renderer2,
    private translate: TranslateService,
    private store: Store<IAppState>,
    private ref: ChangeDetectorRef,
  ) {
  }

  get gridRows(): any[] {
    // TODO https://github.com/ceolter/ag-grid/issues/524
    return this.rows && this.rows.length ? this.rows : null;
  }

  get hasToolbar(): boolean {
    return !!this.toolbarActions;
  }

  get filterColumnName(): string {
    return this.statedFilterColumn && this.statedFilterColumn.getColDef().headerName;
  }

  get allGridColumns(): Column[] {
    return this.gridOptions.columnApi.getAllGridColumns();
  }

  get state(): Observable<IGrid2State> {
    return this.store
      .select((state: IAppState): IGrid2State => {
        let gridState: any = state;
        this.stateKey.split('.').forEach((path: string) => gridState = gridState[path]);
        return gridState as IGrid2State;
      });
  }

  ngOnInit(): void {
    this.setRowsOptions();
    this.createColumnDefs();
    this.defineGridToolbarActions();
    this.subscribeStateChanges();

    const gridMessagesKey = 'grid.messages';
    const translationKeys = [gridMessagesKey];

    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }
    this.translate.get(translationKeys)
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
      .subscribe(event => {
        const { translations } = event;
        // translate column names
        if (this.columnTranslationKey) {
          // IMPORTANT: the key 'grid' should be present in translation files for every grid component
          const columnTranslations = this.columnTranslationKey.split('.').reduce((acc, prop) => acc[prop], translations).grid;
          this.translateColumns(columnTranslations);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('rows' in changes && this.rowsCounterElement) {
      this.setRowsInfo();
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch( { type: Grid2Component.DESTROY_STATE } );

    this.headerColumns = null;

    this.langSubscription.unsubscribe();
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  onSelect(event: any): void {
    const rowNode: RowNode = event.node;
    this.store.dispatch({
      type: Grid2Component.SELECTED_ROWS, payload: {
        rowData: rowNode.data,
        selected: rowNode.isSelected()
      } as IGrid2SelectedRowChangePayload
    });
  }

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  onRowDoubleClicked(): void {
    this.onRowDoubleSelect.emit(this.selected.map(rowNode => rowNode.data));
  }

  onDragStarted(): void {
    this.store.dispatch({ type: Grid2Component.MOVING_COLUMN, payload: { movingColumnInProgress: true } });
  }

  onDragStopped(): void {
    this.store.dispatch({ type: Grid2Component.MOVING_COLUMN, payload: { movingColumnInProgress: false } });

    const currentGridColumns: Column[] = this.gridOptions.columnApi.getAllGridColumns();
    this.dispatchColumnsPositions({
      columnsPositions: currentGridColumns.map((column: Column) => column.getColDef().field)
    });
  }

  onSaveFilterChanges(): void {
    this.dispatchCloseFilter();
  }

  onCloseFilterDialog(): void {
    this.dispatchCloseFilter();
  }

  dispatchSortingDirection(payload: IGrid2SortingDirectionSwitchPayload): void {
    this.store.dispatch({ type: Grid2Component.SORTING_DIRECTION, payload: payload });
  }

  dispatchColumnsPositions(payload: IGrid2ColumnsPositionsChangePayload): void {
    this.store.dispatch({ type: Grid2Component.COLUMNS_POSITIONS, payload: payload });
  }

  dispatchShowFilter(payload: IGrid2ShowFilterPayload): void {
    this.store.dispatch({ type: Grid2Component.OPEN_FILTER, payload: payload });
  }

  dispatchCloseFilter(): void {
    this.store.dispatch({ type: Grid2Component.CLOSE_FILTER });
  }

  private getColumnByName(field: string): Column {
    return this.allGridColumns.find((column: Column) => column.getColDef().field === field);
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

  private setRowsInfo(): void {
    this.rowsCounterElement.text = this.translate.instant('default.grid.selectedCounts', {
      length: this.rows.length,
      selected: this.selected.length
    });
  }

  private subscribeStateChanges(): void {
    if (!this.stateKey) {
      return;
    }
    this.stateSubscription = this.state.subscribe(this.onStateChange.bind(this));
  }

  private onStateChange(state: IGrid2State): void {
    if (!state) {
      return;
    }
    this.selected = state.selectedRows;
    this.statedFilterColumn = state.filterColumnName ? this.getColumnByName(state.filterColumnName) : null;
    this.headerColumns.forEach((gridHeaderComponent: GridHeaderComponent) => gridHeaderComponent.refreshState(state));

    if (!this.remoteSorting) {
      this.applyClientSorting(state);
    }
    this.setRowsInfo();

    this.ref.detectChanges();
  }

  private applyClientSorting(state: IGrid2State): void {
    if (!state.columns || !Object.keys(state.columns).length) {
      return;
    }
    const sortModel = this.allGridColumns.map((column: Column) => {
      const columnId: string = column.getColDef().field;
      return state.columns[columnId]
        ? {
          colId: columnId,
          sort: state.columns[columnId].sortingDirection === Grid2SortingEnum.ASC ? Column.SORT_ASC : Column.SORT_DESC
        } : null
    }).filter(item => !!item);

    if (sortModel.length) {
      this.gridOptions.api.setSortModel(sortModel);
    }
  }

  private defineGridToolbarActions() {
    if (!this.footerPresent) {
      return;
    }
    this.gridToolbarActions = [];
    this.gridToolbarActions.push(this.rowsCounterElement = { control: ToolbarControlEnum.LABEL });
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

  private setRowsOptions(): void {
    this.gridOptions = {
      localeText: {
        rowGroupColumnsEmptyMessage: this.translate.instant('default.grid.groupDndTitle'),
      },
      rowGroupPanelShow: this.showDndGroupPanel ? 'always' : '',
      groupColumnDef: {
        headerValueGetter: () => this.translate.instant('default.grid.groupColumn'),
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
      onGridReady: (params) => this.fitGridSize(),
      onGridSizeChanged: (params) => this.fitGridSize(),
      onColumnRowGroupChanged: (event?: any) => this.onColumnRowGroupChanged(event)
    };
  }

  private fitGridSize(): void {
    const gridPanel = this.gridOptions.api['gridPanel']; // private property
    const availableWidth: number = gridPanel.getWidthForSizeColsToFit();
    if (availableWidth > 0) {
      // Prevent horizontal scrollbar
      // Ag-grid workaround. The official examples have the same issue
      gridPanel.columnController.sizeColumnsToFit(availableWidth - gridPanel.scrollWidth * 2);
    }
  }

  private onColumnRowGroupChanged(event: ColumnChangeEvent): void {
    this.fitGridSize();

    this.store.dispatch({
      type: Grid2Component.GROUPING_COLUMNS, payload: {
        groupingColumns: event.getColumns().map((column: Column) => column.getColId())
      }
    });
  }
}
