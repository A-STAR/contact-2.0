import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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

import { IGridSelectionType } from '../grids.interface';
import { ISimpleGridColumn } from './grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GridsService } from '../grids.service';

import { EmptyOverlayComponent } from '../overlays/empty/empty.component';
import { GridToolbarComponent } from '../toolbar/toolbar.component';

import { isEmpty } from '@app/core/utils/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-height' },
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> implements OnInit, OnChanges, OnDestroy {
  @ViewChild(GridToolbarComponent) gridToolbar: GridToolbarComponent;

  @Input() columns: ISimpleGridColumn<T>[];
  @Input() idKey = 'id';
  @Input() persistenceKey: string;
  @Input() rows: T[];
  @Input() rowClass: (item: T) => string;
  @Input() selectionType: IGridSelectionType = IGridSelectionType.SINGLE;
  @Input() showToolbar = false;
  @Input() toolbar: IToolbarItem[];

  @Input()
  set selection(selection: T[]) {
    if (!isEmpty(selection)) {
      const ids = selection.map(item => item[this.idKey]);
      this.gridApi.forEachNodeAfterFilterAndSort(node => {
        const isSelected = ids.includes(node.data[this.idKey]);
        node.setSelected(isSelected);
      });
      this.cdRef.markForCheck();
    }
  }

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
    noRowsOverlayComponentFramework: EmptyOverlayComponent,
    onColumnMoved: () => this.saveSettings(),
    onColumnResized: () => this.saveSettings(),
    onRowDoubleClicked: event => this.onRowDoubleClicked(event),
    onSelectionChanged: () => this.onSelectionChanged(),
    onSortChanged: () => this.saveSettings(),
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

  ngOnInit(): void {
    if (!this.persistenceKey) {
      throw new Error('Persistence key for simple grid must be specified');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.colDefs = this.gridsService.convertColumnsToColDefs(this.columns, this.persistenceKey);
      this.cdRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.saveSettings();
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
    if (this.gridToolbar) {
      this.gridToolbar.update();
    }
  }

  private getContextMenuItems(params: GetContextMenuItemsParams): string[] {
    return [
      'copy',
      'copyWithHeaders',
    ];
  }

  private saveSettings(): void {
    this.gridsService.saveSettings(this.persistenceKey, this.gridApi, this.columnApi);
  }
}
