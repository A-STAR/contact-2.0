import { ChangeDetectionStrategy, Component, Inject, forwardRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IGridEntity, IEntityGridAction } from '../../entity-grid.interface';

import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { EntityGridComponent } from '@app/routes/ui/grids/entity-grid/entity-grid.component';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-entity-edit-action',
  template: '',
})
export class EntityEditActionComponent implements IEntityGridAction, OnInit {

  type = 'edit';

  constructor(
    @Inject(forwardRef(() => EntityGridComponent)) private grid: EntityGridComponent<IGridEntity>,
    private userPermissionsService: UserPermissionsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) { }

  ngOnInit(): void {
    this.grid.actions.push(this);
  }

  enabled(permissions: string[]): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.hasAll(permissions),
      this.grid.selectedRows$.map(rows => rows && rows.length === 1)
    ]);
  }

  action(): void {
    this.onEdit(this.grid.selectedRows[0]);
  }

  onEdit(row: IGridEntity): void {
    this.routingService.navigate([ String(row.id) ], this.route);
  }
}
