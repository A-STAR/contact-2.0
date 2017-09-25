import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  IGridTreeColumn,
  IGridTreeRow,
  IGridTreeDragAndDropEvent,
  IUniqueIdGetter,
  GridTreeDragAndDropEventTypeEnum
} from './gridtree.interface';

import { GridTreeService } from './gridtree.service';

@Component({
  selector: 'app-gridtree',
  templateUrl: './gridtree.component.html',
  styleUrls: [ './gridtree.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTreeService ]
})
export class GridTreeComponent<T> implements OnDestroy {
  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() dnd = false;

  @Output() select = this.gridTreeService.select.map(row => row.data);
  @Output() dblclick = this.gridTreeService.dblclick.map(row => row.data);

  private _rows: Array<IGridTreeRow<T>> = [];

  private gridTreeServiceSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {
    if (this.dnd) {
      this.gridTreeServiceSubscription = this.gridTreeService.drop.subscribe((event: IGridTreeDragAndDropEvent<T>) => {
        if (
          this.idGetter(event.draggedRow) === this.idGetter(event.targetRow) ||
          this.gridTreeService.isChild(event.targetRow, event.draggedRow, this.idGetter)
        ) {
          return;
        }
        this._rows = this.gridTreeService.removeRowFrom(this._rows, event.draggedRow, this.idGetter);
        if (event.type === GridTreeDragAndDropEventTypeEnum.INTO) {
          this._rows = this.gridTreeService.addRowTo(this._rows, event.draggedRow, event.targetRow, this.idGetter);
        } else {
          this._rows = this.gridTreeService.addRowAfter(this._rows, event.draggedRow, event.targetRow, this.idGetter);
        }
        this.cdRef.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dnd) {
      this.gridTreeServiceSubscription.unsubscribe();
    }
  }

  get rows(): Array<IGridTreeRow<T>> {
    return this._rows;
  }

  @Input('rows')
  set rows(rows: Array<IGridTreeRow<T>>) {
    this._rows = rows;
    this.cdRef.markForCheck();
  }

  @Input() idGetter = ((row: IGridTreeRow<T>) => row.data['id']) as IUniqueIdGetter<T>;
}
