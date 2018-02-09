import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  ViewEncapsulation,
  Input, OnInit, Output, OnChanges, SimpleChanges
} from '@angular/core';

import 'ag-grid-enterprise';
import { ColDef, GridApi, GridOptions, RowDragEndEvent, RowEvent } from 'ag-grid';

import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';

import { GridTree2Service } from '@app/shared/components/gridtree2/gridtree2.service';

@Component({
  selector: 'app-gridtree2',
  templateUrl: './gridtree2.component.html',
  styleUrls: [ './gridtree2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ GridTree2Service ],
})
export class GridTree2Component<T> implements OnInit, OnChanges {
  @Input() rows: IGridTreeRow<T>[];
  @Input() columns: ColDef[];
  @Input() translateColumnLabels: boolean;
  @Input() autoGroupColumnDef: ColDef;
  @Input() rowSelection = 'single';
  @Input() getDataPath: Function;
  @Input() getRowNodeId: Function;
  @Input() dnd: boolean;
  @Input() rowHeight: number;

  @Output() select = new EventEmitter<IGridTreeRow<T>>();
  @Output() move = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();

  gridApi: GridApi;
  gridOptions: GridOptions;
  groupDefaultExpanded: number;

  constructor(
    private gridTree2Service: GridTree2Service,
  ) {}

  ngOnInit(): void {
    this.groupDefaultExpanded = -1;
    this.gridOptions = {
      rowHeight: this.rowHeight,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { rows } = changes;

    if (rows && rows.currentValue && !rows.firstChange) {
      this.gridApi.redrawRows();
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onSelect(): void {
    this.select.emit(this.gridApi.getSelectedRows()[0]);
  }

  onDblClick(event: RowEvent): void {
    this.dblclick.emit(event.data);
  }

  onDragEnd(event: RowDragEndEvent): void {
    const overNode = event.overNode;

    if (overNode) {
      const placeToDrop = overNode.data.isParent ? overNode : overNode.parent;
      const movingData = event.node.data;
      const newParentPath = placeToDrop.data ? placeToDrop.data[this.autoGroupColumnDef.field] : [];
      const needToChangeParent = !this.gridTree2Service.arePathsEqual(newParentPath, movingData[this.autoGroupColumnDef.field]);
      const invalidMode = this.gridTree2Service.isSelectionParentOfTarget(event.node, placeToDrop);

      if (invalidMode) {
        this.move.emit(null);
      }

      if (needToChangeParent && !invalidMode) {
        const updatedRows = [];
        this.gridTree2Service.moveToPath(this.autoGroupColumnDef, newParentPath, event.node, updatedRows);
        this.gridApi.updateRowData({ update: updatedRows });
        this.gridApi.clearFocusedCell();
        this.move.emit(updatedRows[0]);
      }
    }
  }

}
