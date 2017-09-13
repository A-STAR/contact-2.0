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

  private _processedRows: Array<any>;

  constructor(private gridTreeService: GridTreeService<T>) {
    this.gridTreeService.drop.subscribe(([ row1, row2 ]: Array<IGridTreeRow<T>>) => {
      const id1 = this.idGetter(row1);
      const id2 = this.idGetter(row2);

      if (id1 === id2) {
        return;
      }

      this.rows = this.rows.filter(row => this.idGetter(row) !== id1);

      if (row2.children) {
        row2.children.push(row1);
      } else {
        row2.children = [ row1 ];
      }
    });
  }

  @Input() idGetter = (row: IGridTreeRow<T>) => row.data['id'];
}
