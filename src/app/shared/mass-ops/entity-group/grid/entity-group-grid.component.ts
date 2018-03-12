import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';

import { IEntityGroup } from '../entity-group.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { EntityGroupService } from '../entity-group.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-entity-group-grid',
  templateUrl: './entity-group-grid.component.html',
  styleUrls: ['./entity-group-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupGridComponent implements OnInit {

  @Input() entityTypeId: number;
  @Input() manualGroup: boolean;

  columns: ISimpleGridColumn<IEntityGroup>[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'comment' },
  ].map(addGridLabel('widgets.entityGroup.grid'));

  entityGroups: IEntityGroup[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService
  ) { }

  ngOnInit(): void {
    this.entityGroupService.fetchAll(this.entityTypeId, this.manualGroup)
      .subscribe(groups => {
        this.entityGroups = groups;
        this.cdRef.markForCheck();
      });
  }

  onSelect(groups: IEntityGroup[]): void {
    this.entityGroupService.dispatchAction(
      EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, { type: 'select', payload: groups[0] }
    );
  }

  onDblClick(group: IEntityGroup): void {
    this.entityGroupService.dispatchAction(
      EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, { type: 'dblclick', payload: group }
    );
  }
}
