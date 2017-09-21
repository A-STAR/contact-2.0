import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree/gridtree.interface';

import { GridTreeWrapperService } from './gridtree-wrapper.service';

@Component({
  selector: 'app-gridtree-wrapper',
  templateUrl: './gridtree-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTreeWrapperService ]
})
export class GridTreeWrapperComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];

  @Output() select = new EventEmitter<IGridTreeRow<T>>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();

  private _rows: Array<IGridTreeRow<T>> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get rows(): Array<IGridTreeRow<T>> {
    return this._rows;
  }

  @Input('rows')
  set rows(rows: Array<IGridTreeRow<T>>) {
    this._rows = rows;
    this.cdRef.markForCheck();
  }

  @Input() idGetter = ((row: IGridTreeRow<T>) => row.data['id']) as IUniqueIdGetter<T>;

  onRowSelect(row: IGridTreeRow<T>): void {
    this.select.emit(row);
  }

  onRowDblClick(row: IGridTreeRow<T>): void {
    this.dblclick.emit(row);
  }
}
