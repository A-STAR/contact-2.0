import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  ColDef,
  ColumnApi,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  RowDoubleClickedEvent,
} from 'ag-grid';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, mergeMap, tap } from 'rxjs/operators';

import { IGridSelectionType } from '@app/shared/components/grids/grids.interface';
import { ISimpleGridColumn } from './grid.interface';

import { GridsService } from '../grids.service';

import { GridToolbarComponent } from '../toolbar/toolbar.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-height' },
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> implements OnChanges, OnDestroy {
  @ViewChild(GridToolbarComponent) toolbar: GridToolbarComponent;

  @Input() columns: ISimpleGridColumn<T>[];
  @Input() persistenceKey: string;
  @Input() rows: T[];
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

  columnApi: ColumnApi;
  gridApi: GridApi;

  colDefs: ColDef[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridsService: GridsService,
  ) {}

  get rowClassCallback(): any {
    return this.rowClass
      ? params => this.rowClass(params.data)
      : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.colDefs = this.gridsService.convertColumnsToColDefs(this.columns, this.persistenceKey);
    this.cdRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.gridsService.saveSettings(this.persistenceKey, this.gridApi, this.columnApi);
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridsService.restoreSortModel(this.persistenceKey, this.gridApi);
    this.updateToolbar();
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
