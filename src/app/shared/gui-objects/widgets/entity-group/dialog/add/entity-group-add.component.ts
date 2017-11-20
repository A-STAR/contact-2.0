import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, Inject } from '@angular/core';

import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { EntityGroupService } from '../../entity-group.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-entity-group-add',
  templateUrl: './entity-group-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupAddComponent extends DialogFunctions {

  @Input() debts: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService,
    @Inject('entityTypeId') private entityTypeId: number,
  ) {
    super();
  }

  onSelect(group: IEntityGroup): void {
    this.entityGroupService.addToGroup(this.entityTypeId, group.id, this.debts)
      .subscribe(result => {
        this.count = result.massInfo.total;
        this.successCount = result.massInfo.processed;
        this.setDialog('addResult');
        this.cdRef.markForCheck();
      });
  }

  onAddResult(): void {
    this.close.emit(true);
  }

  onClose(): void {
    this.close.emit(false);
  }
}
