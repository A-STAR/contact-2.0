import { Injectable, EventEmitter } from '@angular/core';

import { IGridTreeRow } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  drop = new EventEmitter<Array<IGridTreeRow<T>>>();

  private _draggedRow: IGridTreeRow<T> = null;

  onDragStart(event: DragEvent, row: IGridTreeRow<T>): void {
    this._draggedRow = row;
  }

  onDrop(event: DragEvent, row: IGridTreeRow<T>): void {
    this.drop.emit([this._draggedRow, row]);
    this._draggedRow = null;
  }
}
