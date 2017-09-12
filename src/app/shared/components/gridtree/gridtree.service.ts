import { Injectable } from '@angular/core';

import { IGridTreeRow, IGridTreeRowEvent } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  private _draggedRow: IGridTreeRow<T>;
  private _overRow: IGridTreeRow<T>;
  private _overMode: 'before' | 'on' | 'after';
  private _y0: number;

  get draggedRow(): IGridTreeRow<T> {
    return this._draggedRow;
  }

  onMouseDown(event: IGridTreeRowEvent<T>): void {
    if (event.event.button === 0) {
      this._draggedRow = event.row;
      this._y0 = event.event.clientY - ((event.event.target as HTMLElement).closest('.gridtree-row') as HTMLElement).offsetTop;
    }
  }

  onMouseMove(event: MouseEvent): number {
    return event.clientY - this._y0;
  }

  onMouseOver(event: IGridTreeRowEvent<T>): void {
    this._overRow = event.row;
    console.log(event);
  }

  onMouseUp(event: MouseEvent): void {
    this._draggedRow = null;
    this._overRow = null;
  }
}
