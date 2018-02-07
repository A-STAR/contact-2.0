import {
  Component, ChangeDetectionStrategy, EventEmitter, Input, Output, OnInit
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
export class GridTree2WrapperComponent<T> implements OnInit {
  @Input() rows: IGridTreeRow<T>[];
  @Input() columns: IAGridWrapperTreeColumn<T>[];
  @Input() translateColumnLabels: boolean;
  @Input() dnd: boolean;

  @Output() select = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T> | null>();

  convertedRows: any[];
  convertedCols: ColDef[];
  getDataPath: Function;
  autoGroupColumnDef: ColDef;

  constructor(
    private gridTree2WrapperService: GridTree2WrapperService<T>,
  ) {}

  ngOnInit(): void {
    const columns = this.gridTree2WrapperService.mapColumns(this.columns, this.translateColumnLabels);

    this.convertedCols = columns.filter(column => !column.isDataPath).map(column => column.column);
    this.convertedRows = this.gridTree2WrapperService.mapRows(this.rows, columns);
    this.getDataPath = data => data[columns.find(column => column.isDataPath).column.field];
    this.autoGroupColumnDef = columns.find(column => column.isDataPath).column;
  }

  onSelect(row: any): void {
    this.select.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  onDblClick(row: any): void {
    this.dblclick.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

}
