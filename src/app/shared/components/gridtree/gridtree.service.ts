import { Injectable } from '@angular/core';

import { IGridTreeRow } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  private _draggedRow: IGridTreeRow<T> = null;
  private _latestOffset: number;

  get isDragging(): boolean {
    return this._draggedRow !== null;
  }

  onMouseDown(event: MouseEvent, row: IGridTreeRow<T>): void {
    if (event.button === 0) {
      this._draggedRow = row;
      this._latestOffset = event.clientY - this.getRowOffsetTop(event);
    }
  }

  onMouseMove(event: MouseEvent): number {
    return event.clientY - this._latestOffset;
  }

  onMouseUp(event: MouseEvent): void {
    this._draggedRow = null;
  }

  private getRowOffsetTop(event: MouseEvent): number {
    return ((event.target as HTMLElement).closest('app-gridtree-rowgroup') as HTMLElement).offsetTop;
  }
}
