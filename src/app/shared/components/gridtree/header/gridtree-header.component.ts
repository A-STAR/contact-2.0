import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

@Component({
  selector: 'app-gridtree-header',
  templateUrl: './gridtree-header.component.html',
  styleUrls: [ './gridtree-header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeHeaderComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>>;
}
