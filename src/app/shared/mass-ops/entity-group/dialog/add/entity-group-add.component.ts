import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { EntityGroupService } from '../../entity-group.service';

@Component({
  selector: 'app-entity-group-add',
  templateUrl: './entity-group-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupAddComponent implements OnInit  {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  manualGroup = true;
  entityTypeId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService,
  ) {}

  ngOnInit(): void {
    this.entityTypeId = this.entityGroupService.getEntityTypeId(this.actionData);
  }

  onSelect(group: IEntityGroup): void {
    this.entityGroupService.addToGroup(this.actionData, group.id)
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
