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
} from '@angular/core';

import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  RowDoubleClickedEvent,
} from 'ag-grid';

import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IGridSelectionType, IGridTreePath } from '../grids.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from './grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContextMenuService } from '../context-menu/context-menu.service';
import { GridsService } from '../grids.service';

import { EmptyOverlayComponent } from '../overlays/empty/empty.component';
import { GridToolbarComponent } from '../toolbar/toolbar.component';

import { isEmpty } from '@app/core/utils/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> implements OnChanges, OnDestroy {
  @ViewChild(GridToolbarComponent) gridToolbar: GridToolbarComponent;

  @Input() actions: IMetadataAction[] = [];
  @Input() columns: ISimpleGridColumn<T>[];
  @Input() idKey = 'id';
  @Input() persistenceKey: string;
  @Input() rowClass: (item: T) => string;
  @Input() selectionType: IGridSelectionType = IGridSelectionType.SINGLE;
  @Input() showToolbar = false;
  @Input() toolbar: IToolbarItem[];
  @Input() treeData: boolean;

  @Input()
  set rows(rowData: T[]) {
    if (this.treeData && rowData && rowData.length) {
      this.rowData = this.gridsService.convertTreeData(rowData);
    } else {
      this.rowData = rowData;
    }
  }

  @Input()
  set selection(selection: T[]) {
    if (!isEmpty(selection) && this.gridApi) {
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
  @Output() action = new EventEmitter<IAGridAction>();

  gridOptions: GridOptions = {
    defaultColDef: {
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
    getDataPath: (data: T) => (data as T & IGridTreePath).path,
    enableColResize: true,
    enableFilter: true,
    enableRangeSelection: true,
    enableSorting: true,
    getContextMenuItems: (selection) => this.contextMenuService.onCtxMenuClick(
      {
        actions: this.actions,
        selected: this.selection,
        selection,
        cb: (action) => this.action.emit(action)
      },
      this.getContextMenuSimpleItems()
    ),
    headerHeight: 32,
    noRowsOverlayComponentFramework: EmptyOverlayComponent,
    onColumnMoved: () => this.saveSettings(),
    onColumnResized: () => this.saveSettings(),
    onRowDoubleClicked: event => this.onRowDoubleClicked(event),
    onSelectionChanged: () => this.onSelectionChanged(),
    onSortChanged: () => this.saveSettings(),
    rowHeight: 32,
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

  autoGroupColumnDef: ColDef;

  colDefs: ColDef[];
  rowData: T[] | (T & IGridTreePath)[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contextMenuService: ContextMenuService,
    private gridsService: GridsService,
  ) {}

  get rowClassCallback(): any {
    return this.rowClass
      ? params => this.rowClass(params.data)
      : null;
  }

  get selection(): T[] {
    return this.gridApi
      ? this.gridApi.getSelectedNodes().map(node => node.data)
      : [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.autoGroupColumnDef = this.gridsService.getRowGrouping(this.columns);
      this.colDefs = this.gridsService.convertColumnsToColDefs(this.columns, this.persistenceKey);
      this.cdRef.markForCheck();
    }
  }

  deselectAll(): void {
    this.gridApi.deselectAll();
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

  private getContextMenuSimpleItems(): string[] {
    return [
      'copy',
      'copyWithHeaders',
    ];
  }

  private saveSettings(): void {
    this.gridsService.saveSettings(this.persistenceKey, this.gridApi, this.columnApi);
  }
}
