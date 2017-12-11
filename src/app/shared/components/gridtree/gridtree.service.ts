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

  removeSelection(): void {
    this.onSelect(null);
  }

  addRowTo(
    rows: Array<IGridTreeRow<T>>,
    row: IGridTreeRow<T>,
    parent: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): Array<IGridTreeRow<T>> {
    return rows
      .map(r => {
        const lastChild = (r.children || []).slice(-1).pop();
        const sortOrder = lastChild ? lastChild.sortOrder + 1 : 1;
        return idGetter(r) === idGetter(parent)
          ? { ...r, isExpanded: true, children: [ ...(r.children || []), { ...row, parentId: idGetter(parent), sortOrder } ] }
          : r;
        })
      .map(r => {
        return r.children && r.children.length > 0
          ? { ...r, children: this.addRowTo(r.children, row, parent, idGetter) }
          : r;
      });
  }

  addRowAfter(
    rows: Array<IGridTreeRow<T>>,
    row: IGridTreeRow<T>,
    parent: IGridTreeRow<T>,
    idGetter: IUniqueIdGetter<T>,
  ): Array<IGridTreeRow<T>> {
    const i = rows.findIndex(r => idGetter(r) === idGetter(parent));
    const sortOrder = i >= 0 ? rows[i].sortOrder + (rows[i].sortOrder > row.sortOrder ? 0 : 1) : null;
    return (i >= 0
      ? [ ...rows.slice(0, i + 1), { ...row, sortOrder, parentId: rows[i].parentId }, ...rows.slice(i + 1) ]
      : rows.map(r => {
          return r.children && r.children.length
            ? { ...r, children: this.addRowAfter(r.children, row, parent, idGetter) }
            : r;
        }));
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
      });
  }

  findById(rows: Array<IGridTreeRow<T>>, id: number | string, idGetter: IUniqueIdGetter<T>): IGridTreeRow<T> {
    const row = rows.find(r => idGetter(r) === id);
    if (row) {
      return row;
    }
    return rows.reduce((acc, r) => acc || (r.children ? this.findById(r.children, id, idGetter) : null), null);
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
