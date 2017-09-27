import { Injectable, EventEmitter } from '@angular/core';

import { IGridTreeRow, IGridTreeDragAndDropEvent, IUniqueIdGetter, GridTreeDragAndDropEventTypeEnum } from './gridtree.interface';

@Injectable()
export class GridTreeService<T> {
  dblclick = new EventEmitter<IGridTreeRow<T>>();
  drop = new EventEmitter<IGridTreeDragAndDropEvent<T>>();
  select = new EventEmitter<IGridTreeRow<T>>();

  private _draggedRow: IGridTreeRow<T> = null;
  private _selectedRow: IGridTreeRow<T> = null;

  get draggedRow(): IGridTreeRow<T> {
    return this._draggedRow;
  }

  get selectedRow(): IGridTreeRow<T> {
    return this._selectedRow;
  }

  onSelect(row: IGridTreeRow<T>): void {
    this._selectedRow = row;
    this.select.emit(row);
  }

  onDoubleClick(row: IGridTreeRow<T>): void {
    this.dblclick.emit(row);
  }

  onDragStart(event: DragEvent, row: IGridTreeRow<T>): void {
    this._draggedRow = row;
  }

  onDrop(event: DragEvent, row: IGridTreeRow<T>): void {
    this.drop.emit({
      draggedRow: this._draggedRow,
      targetRow: row,
      type: GridTreeDragAndDropEventTypeEnum.INTO
    });
    this._draggedRow = null;
  }

  onDividerDrop(event: DragEvent, row: IGridTreeRow<T>): void {
    this.drop.emit({
      draggedRow: this._draggedRow,
      targetRow: row,
      type: GridTreeDragAndDropEventTypeEnum.AFTER
    });
    this._draggedRow = null;
  }

  addRowTo(
    rows: Array<IGridTreeRow<T>>,
    row: IGridTreeRow<T>,
    parent: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): Array<IGridTreeRow<T>> {
    return rows
      .map(r => {
        return idGetter(r) === idGetter(parent)
          ? { ...r, isExpanded: true, children: [ ...(r.children || []), row ] }
          : r;
        })
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.addRowTo(r.children, row, parent, idGetter) }
          : r;
      })
      .map((r, sortOrder) => ({ ...r, sortOrder }));
  }

  addRowAfter(
    rows: Array<IGridTreeRow<T>>,
    row: IGridTreeRow<T>,
    parent: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): Array<IGridTreeRow<T>> {
    const i = rows.findIndex(r => idGetter(r) === idGetter(parent));
    return (i >= 0
      ? [ ...rows.slice(0, i + 1), row, ...rows.slice(i + 1) ]
      : rows.map(r => {
          return r.children && r.children.length
            ? { ...r, children: this.addRowAfter(r.children, row, parent, idGetter) }
            : r;
        })).map((r, sortOrder) => ({ ...r, sortOrder }));
  }

  removeRowFrom(
    rows: Array<IGridTreeRow<T>>,
    row: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): Array<IGridTreeRow<T>> {
    return rows
      .filter(r => idGetter(r) !== idGetter(row))
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.removeRowFrom(r.children, row, idGetter) }
          : r;
      })
      .map((r, sortOrder) => ({ ...r, sortOrder }));
  }

  isChild(
    row: IGridTreeRow<T>,
    parent: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): boolean {
    return parent.children && parent.children.length > 0
      ? parent.children.reduce((acc, child) => {
          return acc || idGetter(child) === idGetter(row) || this.isChild(row, child, idGetter);
        }, false)
      : false;
  }
}
