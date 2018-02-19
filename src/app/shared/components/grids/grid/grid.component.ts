import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ColDef, GetContextMenuItemsParams, GridApi, GridOptions, RowDoubleClickedEvent } from 'ag-grid';
import { first } from 'rxjs/operators';

import { IGridSelectionType } from '@app/shared/components/grids/grids.interface';
import { ISimpleGridColumn } from './grid.interface';

import { GridsService } from '../grids.service';

import { GridToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-height' },
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> {
  @ViewChild(GridToolbarComponent) toolbar: GridToolbarComponent;

  @Input()
  set columns(columns: ISimpleGridColumn<T>[]) {
    this.gridsService
      .convertColumnsToColDefs(columns)
      .pipe(
        first(),
      )
      .subscribe(colDefs => {
        this._colDefs = colDefs;
        this.updateColumns();
      });
  }

  @Input()
  set rows(rows: T[]) {
    this._rows = rows;
    this.updateRows();
  }

  @Input() rowClass: (item: T) => string;
  @Input() selectionType: IGridSelectionType = IGridSelectionType.SINGLE;
  @Input() showToolbar = false;

  @Output() select = new EventEmitter<T[]>();
  @Output() dblClick = new EventEmitter<T>();

  gridOptions: GridOptions = {
    defaultColDef: {
      enableRowGroup: false,
      filterParams: {
        newRowsAction: 'keep',
      },
      headerComponentParams: {
        // headerHeight: this.headerHeight,
        enableMenu: true,
      },
      menuTabs: [
        'filterMenuTab',
        'columnsMenuTab',
      ],
    },
    enableColResize: true,
    enableFilter: true,
    enableRangeSelection: true,
    enableSorting: true,
    getContextMenuItems: this.getContextMenuItems.bind(this),
    headerHeight: 28,
    onSelectionChanged: () => this.onSelectionChanged(),
    onRowDoubleClicked: event => this.onRowDoubleClicked(event),
    rowHeight: 28,
    rowSelection: 'multiple',
    showToolPanel: false,
    suppressPaginationPanel: true,
    suppressScrollOnNewData: true,
    toolPanelSuppressPivotMode: true,
    toolPanelSuppressPivots: true,
    toolPanelSuppressRowGroups: true,
    toolPanelSuppressValues: true,
  };

  gridApi: GridApi;

  private _colDefs: ColDef[];
  private _rows: T[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridsService: GridsService,
  ) {}

  get colDefs(): ColDef[] {
    return this._colDefs;
  }

  get rows(): T[] {
    return this._rows;
  }

  get rowClassCallback(): any {
    return this.rowClass
      ? params => this.rowClass(params.data)
      : null;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.updateColumns();
    this.updateRows();
    this.updateToolbar();
  }

  private updateColumns(): void {
    if (this.gridApi && this._colDefs) {
      this.gridApi.sizeColumnsToFit();
      this.updateToolbar();
    }
    this.cdRef.markForCheck();
  }

  private updateRows(): void {
    if (this.gridApi && this._rows) {
      this.gridApi.redrawRows();
      this.updateToolbar();
    }
    this.cdRef.markForCheck();
  }

  private onSelectionChanged(): void {
    const selection = this.gridApi.getSelectedRows();
    this.select.emit(selection);
    this.updateToolbar();
  }

  private onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    this.dblClick.emit(event.data);
  }

  private updateToolbar(): void {
    if (this.toolbar) {
      this.toolbar.update();
    }
  }

  private getContextMenuItems(params: GetContextMenuItemsParams): string[] {
    return [
      'copy',
      'copyWithHeaders',
    ];
  }
}
