import { Injectable } from '@angular/core';

import { IGridTreeRow } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  private _draggedRow: IGridTreeRow<T>;
  private _y0: number;
  private _y1: number;

  onMouseDown(): void {

  }

  onMouseMove(): void {

  }

  onMouseOver(): void {

  }

  onMouseUp(): void {

  }
}
