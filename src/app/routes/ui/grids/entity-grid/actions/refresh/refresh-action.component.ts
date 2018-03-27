import { ChangeDetectionStrategy, Component, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IGridEntity, IEntityGridAction } from '../../entity-grid.interface';

import { EntityGridService } from '@app/routes/ui/grids/entity-grid/entity-grid.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { EntityGridComponent } from '@app/routes/ui/grids/entity-grid/entity-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-entity-refresh-action',
  template: '',
})
export class EntityRefreshActionComponent implements IEntityGridAction, OnInit, OnDestroy {

  type = 'refresh';

  private actionSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => EntityGridComponent)) private grid: EntityGridComponent<IGridEntity>,
    private entityGridService: EntityGridService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    this.grid.actions.push(this);

    const action = this.grid.getActionMetadata(this.type);
    if (action) {
      this.actionSubscription = this.entityGridService
        .getAction(action.params.refreshEvent)
        .subscribe(() => {
          this.grid.fetch();
          this.grid.selectedRows$.next(this.grid.selectedRows);
        });
    }
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  enabled(permissions: string[]): Observable<boolean> {
    return this.userPermissionsService.hasAll(permissions);
  }

  action(): void {
    this.grid.fetch();
  }
}
