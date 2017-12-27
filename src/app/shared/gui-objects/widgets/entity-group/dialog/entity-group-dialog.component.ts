import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  OnInit, Output, OnDestroy, Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IEntityGroup, IGridAction } from '../../entity-group/entity-group.interface';

import { EntityGroupService } from '../entity-group.service';

@Component({
  selector: 'app-entity-group-dialog',
  templateUrl: './entity-group-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupDialogComponent implements OnInit, OnDestroy {

  @Input() entityTypeId: number;
  @Input() manualGroup: boolean;

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IEntityGroup>();

  private selectedEntityGroup: IEntityGroup;
  private entityGroupSelectSub: Subscription;
  private entityGroupClickSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService,
  ) { }

  ngOnInit(): void {
    this.entityGroupSelectSub = this.entityGroupService
      .getPayload<IGridAction>(EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED)
      .filter(action => action.type === 'select')
      .map(action => action.payload)
      .subscribe(group => {
        this.selectedEntityGroup = group;
        this.cdRef.markForCheck();
      });

    this.entityGroupClickSub = this.entityGroupService
      .getPayload<IGridAction>(EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED)
      .filter(action => action.type === 'dblclick')
      .map(action => action.payload)
      .subscribe(group => {
        this.selectedEntityGroup = group;
        this.select.emit(this.selectedEntityGroup);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.entityGroupSelectSub.unsubscribe();
    this.entityGroupClickSub.unsubscribe();
  }

  get hasSelection(): boolean {
    return !!this.selectedEntityGroup;
  }

  onSelect(): void {
    this.select.emit(this.selectedEntityGroup);
  }

  onClose(): void {
    this.close.emit();
  }
}
