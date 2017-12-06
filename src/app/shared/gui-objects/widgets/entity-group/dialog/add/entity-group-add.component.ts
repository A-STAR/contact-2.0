import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, Inject } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { EntityGroupService } from '../../entity-group.service';

@Component({
  selector: 'app-entity-group-add',
  templateUrl: './entity-group-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupAddComponent  {

  @Input() debts: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService,
  ) {}

  @Inject('entityypeId') private entityTypeId: number;

  onSelect(group: IEntityGroup): void {
    this.entityGroupService.addToGroup(this.entityTypeId, group.id, this.debts)
      // .catch(this.notificationsService.updateError().callback())
      .subscribe(result => {
        this.close.emit({ refresh: true });
        this.cdRef.markForCheck();
      });
  }

  onAddResult(): void {
  }

  onClose(): void {
    this.close.emit();
  }
}
