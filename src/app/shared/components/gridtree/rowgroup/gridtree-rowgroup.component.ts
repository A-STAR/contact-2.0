import { Component, ChangeDetectionStrategy, HostListener, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-rowgroup',
  templateUrl: './gridtree-rowgroup.component.html',
  styleUrls: [ './gridtree-rowgroup.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowGroupComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() nestingLevel = 0;
  @Input() row: IGridTreeRow<T>;

  constructor(private gridTreeService: GridTreeService<T>) {}

  private _isExpanded = false;

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.gridTreeService.onMouseDown(event, this.row);
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this._isExpanded = !this._isExpanded;
  }
}
