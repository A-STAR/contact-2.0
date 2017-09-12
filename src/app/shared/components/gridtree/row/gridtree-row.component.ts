import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-row',
  templateUrl: './gridtree-row.component.html',
  styleUrls: [ './gridtree-row.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() nestingLevel = 0;
  @Input() row: IGridTreeRow<T>;

  private _isExpanded = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {}

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this._isExpanded = !this._isExpanded;
  }

  onMouseDown(event: MouseEvent): void {
    this.gridTreeService.onMouseDown({ row: this.row, event });
    this.cdRef.markForCheck();
  }

  onMouseMove(event: MouseEvent): void {
    this.gridTreeService.onMouseOver({ row: this.row, event });
    this.cdRef.markForCheck();
  }
}
