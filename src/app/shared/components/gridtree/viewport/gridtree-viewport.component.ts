import { Component, ChangeDetectionStrategy, HostListener, Input } from '@angular/core';

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
  @Input() rows: Array<IGridTreeRow<T>> = [];

  constructor(private gridTreeService: GridTreeService<T>) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    event.stopPropagation();
    if (this.gridTreeService.isDragging) {
      const offset = this.gridTreeService.onMouseMove(event);
      console.log(offset);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    this.gridTreeService.onMouseUp(event);
  }
}
