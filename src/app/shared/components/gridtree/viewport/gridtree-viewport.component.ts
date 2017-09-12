import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-viewport',
  templateUrl: './gridtree-viewport.component.html',
  styleUrls: [ './gridtree-viewport.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeViewportComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>>;

  draggedRowStyle = {
    top: '0px'
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>
  ) {}

  get viewportRows(): Array<IGridTreeRow<T>> {
    return this.rows.filter(row => row !== this.draggedRow);
  }

  get draggedRow(): IGridTreeRow<T> {
    return this.gridTreeService.draggedRow;
  }

  onMouseMove(event: MouseEvent): void {
    const d = this.gridTreeService.onMouseMove(event);
    this.draggedRowStyle = {
      top: `${d}px`
    };
    this.cdRef.markForCheck();
  }

  onMouseUp(event: MouseEvent): void {
    this.gridTreeService.onMouseUp(event);
    this.cdRef.markForCheck();
  }
}
