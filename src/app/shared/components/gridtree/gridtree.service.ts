import { Injectable, EventEmitter } from '@angular/core';

import { IGridTreeRow, IGridTreeDragAndDropEvent, GridTreeDragAndDropEventType } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  drop = new EventEmitter<IGridTreeDragAndDropEvent<T>>();

  private _draggedRow: IGridTreeRow<T> = null;

  onDragStart(event: DragEvent, row: IGridTreeRow<T>): void {
    this._draggedRow = row;
  }

  onDrop(event: DragEvent, row: IGridTreeRow<T>): void {
    this.drop.emit({
      draggedRow: this._draggedRow,
      targetRow: row,
      type: GridTreeDragAndDropEventType.INTO
    });
    this._draggedRow = null;
  }

  onDividerDrop(event: DragEvent, row: IGridTreeRow<T>): void {
    this.drop.emit({
      draggedRow: this._draggedRow,
      targetRow: row,
      type: GridTreeDragAndDropEventType.AFTER
    });
    this._draggedRow = null;
  }
}
