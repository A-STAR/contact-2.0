import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

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

  private _isExpanded = false;

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  toggle(): void {
    this._isExpanded = !this._isExpanded;
  }
}
