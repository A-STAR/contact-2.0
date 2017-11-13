import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Inject } from '@angular/core';

import { IEntityGroup } from '../entity-group.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { EntityGroupService } from '../entity-group.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

import { GridComponent } from '../../../../components/grid/grid.component';

@Component({
  selector: 'app-entity-group-grid',
  templateUrl: './entity-group-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupGridComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'comment' },
  ];

  gridStyles = { height: '500px' };
  entityGroups: Array<IEntityGroup> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService,
    private messageBusService: MessageBusService,
    @Inject('entityTypeId') private entityTypeId: number,
    @Inject('manualGroup') private manualGroup: boolean,
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(group: IEntityGroup): void {
    this.messageBusService.dispatch(EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, null, group);
  }

  private fetch(): void {
    this.entityGroupService.fetchAll(this.entityTypeId, this.manualGroup).subscribe(groups => {
      this.entityGroups = groups;
      this.cdRef.markForCheck();
    });
  }
}
