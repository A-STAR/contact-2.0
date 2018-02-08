import {
  Component, ChangeDetectionStrategy, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { ColDef } from 'ag-grid';

import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';

import { GridTree2WrapperService } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.service';

@Component({
  selector: 'app-gridtree2-wrapper',
  templateUrl: './gridtree2-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTree2WrapperService ]
})
export class GridTree2WrapperComponent<T> implements OnInit, OnChanges {
  @Input() rows: IGridTreeRow<T>[];
  @Input() columns: IAGridWrapperTreeColumn<T>[];
  @Input() translateColumnLabels: boolean;
  @Input() dnd: boolean;

  @Output() select = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() move = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();

  convertedCols: any[];
  convertedRows: any[];
  convertedColsDef: ColDef[];
  getDataPath: Function;
  autoGroupColumnDef: ColDef;

  constructor(
    private gridTree2WrapperService: GridTree2WrapperService<T>,
  ) {}

  ngOnInit(): void {
    this.convertedCols = this.gridTree2WrapperService.mapColumns(this.columns, this.translateColumnLabels);

    this.convertedColsDef = this.convertedCols.filter(column => !column.isDataPath).map(column => column.column);
    this.getDataPath = data => data[this.convertedCols.find(column => column.isDataPath).column.field];
    this.autoGroupColumnDef = { rowDrag: this.dnd, ...this.convertedCols.find(column => column.isDataPath).column };

    this.mapRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { rows } = changes;

    if (rows && rows.currentValue && !rows.firstChange) {
      this.mapRows();
    }
  }

  onSelect(row: any): void {
    this.select.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  onMove(row: any): void {
    this.move.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  onDblClick(row: any): void {
    this.dblclick.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  private mapRows(): void {
    this.convertedRows = this.gridTree2WrapperService.mapRows(this.rows, this.convertedCols);
  }
}
