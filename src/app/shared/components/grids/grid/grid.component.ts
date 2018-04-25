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
  OnInit,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';

import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  RowDoubleClickedEvent,
  CellValueChangedEvent,
} from 'ag-grid';
import { Subscription } from 'rxjs/Subscription';

import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IContextMenuSimpleOptions } from '@app/shared/components/grids/context-menu/context-menu.interface';
import { IGridSelectionType, IGridTreePath } from '../grids.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from './grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContextMenuService } from '../context-menu/context-menu.service';
import { GridsDefaultsService } from '@app/shared/components/grids/grids-defaults.service';
import { GridsService } from '../grids.service';
import { SettingsService } from '@app/core/settings/settings.service';

import { EmptyOverlayComponent } from '../overlays/empty/empty.component';
import { GridToolbarComponent } from '../toolbar/toolbar.component';

import { isEmpty } from '@app/core/utils/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html',
  providers: [
    GridsDefaultsService
  ],
})
export class SimpleGridComponent<T> implements OnChanges, OnDestroy, OnInit {
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
      const ids = selection.map(item => item && item[this.idKey]).filter(item => item !== undefined);
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
  @Output() cellValueChanged = new EventEmitter<CellValueChangedEvent>();

  private persistenceClearSub: Subscription;
  private routeChangeSub: Subscription;
  private settingsReseted = false;

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
    onColumnVisible: () => this.saveSettings(),
    onRowDoubleClicked: event => this.onRowDoubleClicked(event),
    onCellValueChanged: event => this.onCellValueChanged(event),
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
    private gridsDefaultsService: GridsDefaultsService,
    private gridsService: GridsService,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
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

  ngOnInit(): void {
    this.persistenceClearSub = this.settingsService.onClear$
    .subscribe( _ => this.resetGridSettings());

    this.routeChangeSub = this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter(event => (event as ActivationEnd).snapshot === this.route.snapshot),
      )
      .subscribe(_ => {
        if (this.settingsReseted) {
          this.gridApi.doLayout();
          this.settingsReseted = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.autoGroupColumnDef = this.gridsService.getRowGrouping(this.columns);
      this.colDefs = this.gridsService.convertColumnsToColDefs(this.columns, this.persistenceKey, this.gridsDefaultsService);
      this.cdRef.markForCheck();
    }
  }

  deselectAll(): void {
    this.gridApi.deselectAll();
  }

  ngOnDestroy(): void {
    this.saveSettings();
    this.persistenceClearSub.unsubscribe();
    this.routeChangeSub.unsubscribe();
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

  private onCellValueChanged(event: CellValueChangedEvent): void {
    this.cellValueChanged.emit(event);
  }

  private updateToolbar(): void {
    if (this.gridToolbar) {
      this.gridToolbar.update();
    }
  }

  private getContextMenuSimpleItems(): IContextMenuSimpleOptions {
    return [
      'copy',
      'copyWithHeaders',
      {
        name: 'default.grid.localeText.resetColumns',
        action: () => this.resetGridSettings(),
        // shortcut: 'Alt+R'
      },
    ];
  }

  private saveSettings(): void {
    this.gridsService.saveSettings(this.persistenceKey, this.gridApi, this.columnApi);
  }

  private resetGridSettings(): void {
    this.gridsDefaultsService.reset(this.gridApi, this.columnApi);
    this.settingsReseted = true;
  }
}
