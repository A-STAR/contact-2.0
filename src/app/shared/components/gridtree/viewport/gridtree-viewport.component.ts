import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree.interface';

@Component({
  selector: 'app-gridtree-viewport',
  templateUrl: './gridtree-viewport.component.html',
  styleUrls: [ './gridtree-viewport.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeViewportComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() idGetter = null as IUniqueIdGetter<T>;
  @Input() rows: Array<IGridTreeRow<T>> = [];
}
