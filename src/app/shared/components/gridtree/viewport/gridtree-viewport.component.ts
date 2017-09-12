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

  private rowEvent: IGridTreeRowEvent<T>;

  constructor(private cdRef: ChangeDetectorRef) {}

  get viewportRows(): Array<IGridTreeRow<T>> {
    return this.rows.filter(row => !this.rowEvent || row !== this.rowEvent.row);
  }

  get draggedRow(): IGridTreeRow<T> {
    return this.rowEvent && this.rowEvent.row;
  }

  onMouseDown(rowEvent: IGridTreeRowEvent<T>): void {
    this.rowEvent = rowEvent;
    console.log(rowEvent.event.clientX, rowEvent.event.clientY);
    // console.log((event.target as any).closest('.gridtree-row'));
  }

  onMouseMove(event: MouseEvent): void {
    // console.log(event);
  }

  onMouseUp(event: MouseEvent): void {
    // this.rowEvent = null;
  }
}
