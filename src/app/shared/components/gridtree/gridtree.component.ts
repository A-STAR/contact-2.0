import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from './gridtree.interface';

@Component({
  selector: 'app-gridtree',
  templateUrl: './gridtree.component.html',
  styleUrls: [ './gridtree.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>> = [];
  @Input() displayTreeProp: keyof T;
}
