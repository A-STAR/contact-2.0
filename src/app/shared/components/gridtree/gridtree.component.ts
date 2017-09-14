import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IGridTreeDragAndDropEvent, GridTreeDragAndDropEventTypeEnum } from './gridtree.interface';

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {
    this.gridTreeService.drop.subscribe((event: IGridTreeDragAndDropEvent<T>) => {
      if (this.idGetter(event.draggedRow) === this.idGetter(event.targetRow) || this.isChild(event.targetRow, event.draggedRow)) {
        return;
      }
      this.rows = this.removeRowFrom(this.rows, event.draggedRow);
      if (event.type === GridTreeDragAndDropEventTypeEnum.INTO) {
        this.rows = this.addRowTo(this.rows, event.draggedRow, event.targetRow);
      } else {
        this.rows = this.addRowAfter(this.rows, event.draggedRow, event.targetRow);
      }
      this.cdRef.markForCheck();
    });
  }

  @Input() idGetter = (row: IGridTreeRow<T>) => row.data['id'];

  private addRowTo(rows: Array<IGridTreeRow<T>>, row: IGridTreeRow<T>, parent: IGridTreeRow<T>): Array<IGridTreeRow<T>> {
    return rows
      .map(r => {
        return this.idGetter(r) === this.idGetter(parent)
          ? { ...r, isExpanded: true, children: [ ...(r.children || []), row ] }
          : r;
        })
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.addRowTo(r.children, row, parent) }
          : r;
      });
  }

  private addRowAfter(rows: Array<IGridTreeRow<T>>, row: IGridTreeRow<T>, parent: IGridTreeRow<T>): Array<IGridTreeRow<T>> {
    const i = rows.findIndex(r => this.idGetter(r) === this.idGetter(parent))
    return i >= 0
      ? [ ...rows.slice(0, i + 1), row, ...rows.slice(i + 1) ]
      : rows.map(r => {
          return r.children && r.children.length
            ? { ...r, children: this.addRowAfter(r.children, row, parent) }
            : r;
        });
  }

  private removeRowFrom(rows: Array<IGridTreeRow<T>>, row: IGridTreeRow<T>): Array<IGridTreeRow<T>> {
    return rows
      .filter(r => this.idGetter(r) !== this.idGetter(row))
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.removeRowFrom(r.children, row) }
          : r;
      });
  }

  private isChild(row: IGridTreeRow<T>, parent: IGridTreeRow<T>): boolean {
    return parent.children && parent.children.length > 0
      ? parent.children.reduce((acc, child) => {
          return acc || this.idGetter(child) === this.idGetter(row) || this.isChild(row, child);
        }, false)
      : false;
  }
}
