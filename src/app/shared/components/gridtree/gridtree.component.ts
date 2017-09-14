import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {
    this.gridTreeService.drop.subscribe(([ row1, row2 ]: Array<IGridTreeRow<T>>) => {
      if (row1 === row2 || this.isChild(row2, row1)) {
        return;
      }
      this.rows = this.removeRowFromParent(this.rows, row1);
      this.rows = this.addRowToParent(this.rows, row1, row2);
      this.cdRef.markForCheck();
    });
  }

  @Input() idGetter = (row: IGridTreeRow<T>) => row.data['id'];

  private addRowToParent(rows: Array<IGridTreeRow<T>>, row: IGridTreeRow<T>, parent: IGridTreeRow<T>): Array<IGridTreeRow<T>> {
    return rows
      .map(r => this.idGetter(r) === this.idGetter(parent) ? { ...r, children: [ ...(r.children || []), row ] } : r)
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.addRowToParent(r.children, row, parent) }
          : r;
      });
  }

  private removeRowFromParent(rows: Array<IGridTreeRow<T>>, row: IGridTreeRow<T>): Array<IGridTreeRow<T>> {
    return rows
      .filter(r => this.idGetter(r) !== this.idGetter(row))
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.removeRowFromParent(r.children, row) }
          : r;
      });
  }

  private isChild(row: IGridTreeRow<T>, parent: IGridTreeRow<T>): boolean {
    return parent.children && parent.children.length > 0
      ? parent.children.reduce((acc, child) => acc || child === row || this.isChild(row, child), false)
      : false;
  }
}
