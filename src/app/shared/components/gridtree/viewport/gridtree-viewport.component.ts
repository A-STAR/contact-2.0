import { Component, ChangeDetectionStrategy, HostListener, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-viewport',
  templateUrl: './gridtree-viewport.component.html',
  styleUrls: [ './gridtree-viewport.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeViewportComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() dnd: boolean;
  @Input() idGetter = null as IUniqueIdGetter<T>;
  @Input() rows: Array<IGridTreeRow<T>> = [];

  constructor(private gridTreeService: GridTreeService<T>) {}

  @HostListener('click')
  onClick(): void {
    this.gridTreeService.onSelect(null);
  }
}
