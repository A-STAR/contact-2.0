import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from './gridtree.interface';

import { GridTreeService } from './gridtree.service';

@Component({
  selector: 'app-gridtree',
  templateUrl: './gridtree.component.html',
  styleUrls: [ './gridtree.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTreeService ]
})
export class GridTreeComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>> = [];
  @Input() displayTreeProp: keyof T;
}
