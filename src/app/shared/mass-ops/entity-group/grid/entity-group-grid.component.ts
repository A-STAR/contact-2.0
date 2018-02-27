import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';

import { IEntityGroup } from '../entity-group.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { EntityGroupService } from '../entity-group.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-entity-group-grid',
  templateUrl: './entity-group-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityGroupGridComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() entityTypeId: number;
  @Input() manualGroup: boolean;

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'comment' },
  ];

  gridStyles = { height: '500px' };
  entityGroups: Array<IEntityGroup> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGroupService: EntityGroupService
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(group: IEntityGroup): void {
    this.entityGroupService.dispatchAction(
      EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, { type: 'select', payload: group }
    );
  }

  onDblClick(group: IEntityGroup): void {
    this.entityGroupService.dispatchAction(
      EntityGroupService.MESSAGE_ENTITY_GROUP_SELECTED, { type: 'dblclick', payload: group }
    );
  }

  private fetch(): void {
    this.entityGroupService.fetchAll(this.entityTypeId, this.manualGroup).subscribe(groups => {
      this.entityGroups = groups;
      this.cdRef.markForCheck();
    });
  }
}
