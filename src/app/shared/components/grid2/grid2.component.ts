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
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, ICellRendererParams, GridOptions, RowNode, Column } from 'ag-grid';
import { Store } from '@ngrx/store';

import { IToolbarAction, ToolbarControlEnum } from '../toolbar/toolbar.interface';
import { IAppState } from '../../../core/state/state.interface';
import {IGrid2ColumnsPositionsChangePayload, IGrid2ShowFilterPayload} from './grid2.interface';
import { IGridColumn } from '../grid/grid.interface';
import { IGrid2HeaderParams, IGrid2ServiceDispatcher, IGrid2SortingDirectionSwitchPayload, IGrid2State } from './grid2.interface';

import { GridHeaderComponent } from './header/grid-header.component';

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./grid2.component.scss', './grid2.component.ag-base.css', './grid2.component.ag-theme-fresh.css'],
})
export class Grid2Component implements OnInit, OnChanges, OnDestroy, IGrid2ServiceDispatcher {
  public static SORTING_DIRECTION = 'SORTING_DIRECTION';
  public static COLUMNS_POSITIONS = 'COLUMNS_POSITIONS';
  public static OPEN_FILTER = 'OPEN_FILTER';
  public static CLOSE_FILTER = 'CLOSE_FILTER';
  public static MOVING_COLUMN = 'MOVING_COLUMN';

  @Input() stateKey: string;
  @Input() footerPresent = true;
  @Input() columns: IGridColumn[] = [];
  @Input() columnTranslationKey: string;
  @Input() filterEnabled: boolean = true;                   // ag-grid definition
  @Input() rows: Array<any> = [];
  @Input() styles: { [key: string]: any };
  @Input() toolbarActions: IToolbarAction[];
  @Input() filter(record: any): boolean { return record; }
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRowDoubleSelect: EventEmitter<any> = new EventEmitter();

  selected: Array<any> = [];
  gridToolbarActions: IToolbarAction[];
  columnDefs: ColDef[] = [];
  gridOptions: GridOptions = {};
  filterColumn: Column;

  private langSubscription: EventEmitter<any>;
  private selectedNodes: { [key: string]: RowNode } = {};
  private headerColumns: GridHeaderComponent[] = [];
  private rowsCounterElement;
  private stateSubscription: Subscription;

  constructor(
    private renderer2: Renderer2,
    private translate: TranslateService,
    private store: Store<IAppState>,
  ) {
  }

  get hasToolbar(): boolean {
    return !!this.toolbarActions;
  }

  get filterColumnName(): string {
    return this.filterColumn.getColDef().headerName;
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
    this.langSubscription.unsubscribe();

    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  onSelect(event: any): void {
    const rowNode = event.node;
    this.selectedNodes[rowNode.id] = rowNode.isSelected() ? rowNode : null;
    this.selected = Object.keys(this.selectedNodes)
      .map((nodeId: string) => this.selectedNodes[nodeId] ? this.selectedNodes[nodeId].data : null)
      .filter(data => !!data);

    this.setRowsInfo();
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
    return this.gridOptions.columnApi
      .getAllGridColumns()
      .find((column: Column) => column.getColDef().field === field);
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
    if (state.filterColumnName) {
      this.filterColumn = this.getColumnByName(state.filterColumnName);
    } else {
      this.filterColumn = null;
    }
    this.headerColumns
      .forEach((gridHeaderComponent: GridHeaderComponent) => gridHeaderComponent.refreshState(state));
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
        headerComponent: GridHeaderComponent
      };
      if (column.maxWidth) {
        colDef.maxWidth = column.maxWidth;
      }
      if (column.minWidth) {
        colDef.minWidth = column.minWidth;
      }
      if (column.width) {
        colDef.width = column.width;
      }
      if (!colDef.width) {
        colDef.width = Math.max(colDef.minWidth || 0, colDef.maxWidth || 0);
      }
      if (column.$$valueGetter) {
        colDef.cellRenderer = (params: ICellRendererParams) => column.$$valueGetter(params.data);
      }
      return colDef;
    });
  }

  private setRowsOptions(): void {
    this.gridOptions = this.gridOptions || {};
    this.gridOptions.enableFilter = true;
    this.gridOptions.isExternalFilterPresent = () => this.filterEnabled;
    this.gridOptions.doesExternalFilterPass = (node: RowNode) => this.filter(node.data);
    this.gridOptions.defaultColDef = {
      headerComponentParams: {
        headerHeight: 25,
        enableMenu: true,
        serviceDispatcher: this,
        headerColumns: this.headerColumns,
        renderer2: this.renderer2
      } as IGrid2HeaderParams
    };
  }
}
