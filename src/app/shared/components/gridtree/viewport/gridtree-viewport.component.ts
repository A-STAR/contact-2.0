import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IGridTreeRowEvent } from '../gridtree.interface';

@Component({
  selector: 'app-gridtree-viewport',
  templateUrl: './gridtree-viewport.component.html',
  styleUrls: [ './gridtree-viewport.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeViewportComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>>;

  private _draggedRow: IGridTreeRow<T>;
  private _y0: number;
  private _y1: number;

  constructor(private cdRef: ChangeDetectorRef) {}

  get viewportRows(): Array<IGridTreeRow<T>> {
    return this.rows.filter(row => row !== this._draggedRow);
  }

  get draggedRow(): IGridTreeRow<T> {
    return this._draggedRow;
  }

  get draggedRowStyle(): Object {
    return {
      top: `${this._y1 - this._y0}px`
    };
  }

  onMouseDown(rowEvent: IGridTreeRowEvent<T>): void {
    if (rowEvent.event.button === 0) {
      this._draggedRow = rowEvent.row;
      this._y0 = rowEvent.event.clientY - ((rowEvent.event.target as any).closest('.gridtree-row') as any).offsetTop;
      this.cdRef.markForCheck();
    }
  }

  onMouseMove(event: MouseEvent): void {
    this._y1 = event.clientY;
    this.cdRef.markForCheck();
  }

  onMouseUp(event: MouseEvent): void {
    this._draggedRow = null;
    this.cdRef.markForCheck();
  }
}
