import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-row-content',
  templateUrl: './gridtree-row-content.component.html',
  styleUrls: [ './gridtree-row-content.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowContentComponent<T> {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() displayTreeProp: keyof T;
  @Input() isExpanded = false;
  @Input() isHighlighted = false;
  @Input() nestingLevel = 0;
  @Input() row: IGridTreeRow<T>;

  @Output() toggle = new EventEmitter<void>();

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }
}
