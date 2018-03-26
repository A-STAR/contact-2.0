import { ChangeDetectionStrategy, Component, Inject, forwardRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IGridEntity, IEntityGridAction } from '../../entity-grid.interface';

import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { EntityGridComponent } from '@app/routes/ui/grids/entity-grid/entity-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-entity-add-action',
  template: '',
})
export class EntityAddActionComponent implements IEntityGridAction, OnInit {

  type = 'add';

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
    return this.userPermissionsService.hasAll(permissions);
  }

  action(): void {
    this.onAdd();
  }

  onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }
}
