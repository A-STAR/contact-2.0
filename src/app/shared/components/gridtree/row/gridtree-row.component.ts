import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

@Component({
  selector: 'app-gridtree-row',
  templateUrl: './gridtree-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() row: IGridTreeRow<T>;

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }
}
