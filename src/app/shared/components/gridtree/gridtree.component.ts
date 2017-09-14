import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
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
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>> = [];
  @Input() displayTreeProp: keyof T;

  private gridTreeServiceSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {
    this.gridTreeServiceSubscription = this.gridTreeService.drop.subscribe((event: IGridTreeDragAndDropEvent<T>) => {
      if (
        this.idGetter(event.draggedRow) === this.idGetter(event.targetRow) ||
        this.gridTreeService.isChild(event.targetRow, event.draggedRow, this.idGetter)
      ) {
        return;
      }
      this.rows = this.gridTreeService.removeRowFrom(this.rows, event.draggedRow, this.idGetter);
      if (event.type === GridTreeDragAndDropEventTypeEnum.INTO) {
        this.rows = this.gridTreeService.addRowTo(this.rows, event.draggedRow, event.targetRow, this.idGetter);
      } else {
        this.rows = this.gridTreeService.addRowAfter(this.rows, event.draggedRow, event.targetRow, this.idGetter);
      }
      this.cdRef.markForCheck();
    });
  }

  @Input() idGetter = ((row: IGridTreeRow<T>) => row.data['id']) as IUniqueIdGetter<T>;

  ngOnDestroy(): void {
    this.gridTreeServiceSubscription.unsubscribe();
  }
}
