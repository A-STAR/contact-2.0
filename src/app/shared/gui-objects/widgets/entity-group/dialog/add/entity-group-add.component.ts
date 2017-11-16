import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, Inject } from '@angular/core';

import { IEntityGroup } from '../../../entity-group/entity-group.interface';
import { IActionGridDialogData } from '../../../../../components/action-grid/action-grid.interface';
import { IMetadataActionOption } from '../../../../../../core/metadata/metadata.interface';

import { EntityGroupService } from '../../entity-group.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-entity-group-add',
  templateUrl: './entity-group-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupAddComponent extends DialogFunctions {

  @Input() dialogData: IActionGridDialogData;

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

  get ids(): IMetadataActionOption {
    const { action: { addOptions } } = this.dialogData.action;
    return (addOptions || []).find(option => option.name === 'ids');
  }

  onSelect(group: IEntityGroup): void {
    const ids = this.ids;
    this.entityGroupService.addToGroup(this.entityTypeId, group.id, ids ? ids.value as number[] : null)
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
