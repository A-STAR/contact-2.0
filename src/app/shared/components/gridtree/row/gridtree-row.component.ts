import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IGridTreeRowEvent } from '../gridtree.interface';

@Component({
  selector: 'app-gridtree-row',
  templateUrl: './gridtree-row.component.html',
  styleUrls: [ './gridtree-row.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() nestingLevel = 0;
  @Input() row: IGridTreeRow<T>;

  @Output() mousedown = new EventEmitter<IGridTreeRowEvent<T>>();

  private _isExpanded = false;

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this._isExpanded = !this._isExpanded;
  }

  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.mousedown.emit({ row: this.row, event });
  }

  onMouseDownPropagate(event: IGridTreeRowEvent<T>): void {
    this.mousedown.emit(event);
  }
}
