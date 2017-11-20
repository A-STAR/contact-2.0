import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IEntityGroup } from '../../entity-group/entity-group.interface';

import { EntityGroupService } from '../entity-group.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

@Component({
  selector: 'app-entity-group-dialog',
  templateUrl: './entity-group-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupDialogComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IEntityGroup>();

  private selectedEntityGroup: IEntityGroup;
  private entityGroupSelectSub: Subscription;
  private entityGroupClickSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageBusService: MessageBusService,
  ) { }

  ngOnInit(): void {
    this.entityGroupSelectSub = this.messageBusService
      .select<string, IEntityGroup>(EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, 'select')
      .subscribe(group => {
        this.selectedEntityGroup = group;
        this.cdRef.markForCheck();
      });

    this.entityGroupClickSub = this.messageBusService
      .select<string, IEntityGroup>(EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, 'dblclick')
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
