import { ChangeDetectionStrategy, Component, Inject, forwardRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridEntity, IEntityGridAction, IMetadataEntityGridConfig } from '../../entity-grid.interface';

import { EntityGridService } from '@app/routes/ui/grids/entity-grid/entity-grid.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { EntityGridComponent } from '@app/routes/ui/grids/entity-grid/entity-grid.component';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-entity-delete-action',
  templateUrl: './delete-action.component.html',
})
export class EntityDeleteActionComponent extends DialogFunctions implements IEntityGridAction, OnInit {

  dialog: string;
  type = 'delete';

  constructor(
    @Inject(forwardRef(() => EntityGridComponent)) private grid: EntityGridComponent<IGridEntity>,
    private cdRef: ChangeDetectorRef,
    private entityGridService: EntityGridService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
   }

  ngOnInit(): void {
    this.grid.actions.push(this);
  }

  get config(): IMetadataEntityGridConfig {
    return this.grid.config;
  }

  enabled(permissions: string[]): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.hasAll(permissions),
      this.grid.selectedRows$.map(rows => rows && rows.length === 1)
    ]);
  }

  action(): void {
    this.setDialog('delete');
    this.cdRef.markForCheck();
  }

  onRemove(): void {
    if (this.config.selectionType === 'single') {
      this.entityGridService.delete(this.config.apiKey, this.grid.entityKey, this.grid.selectedRows[0].id)
        .subscribe(() => {
          this.setDialog(null);
          this.grid.selectedRows$.next(null);
          this.grid.fetch();
        });
    }
  }
}
