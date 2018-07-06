import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map, first } from 'rxjs/operators';

import { IPermissionRole } from '../permissions.interface';
import { ITitlebar, ToolbarItemType } from '@app/shared/components/titlebar/titlebar.interface';

import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd, addGridLabel, isEmpty } from '@app/core/utils';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent extends DialogFunctions implements OnInit, OnDestroy {
  editedEntity: IPermissionRole = null;

  roles$: Observable<Array<IPermissionRole>>;

  readonly hasCurrentRole$: Observable<boolean> = this.permissionsService.permissions.pipe(
    map(permissions => !!permissions.currentRole),
  );

  titlebar: ITitlebar = {
    title: 'roles.roles.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.setDialog('add'),
        enabled: this.userPermissionsService.has('ROLE_ADD')
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.COPY,
        action: () => this.setDialog('copy'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ROLE_COPY'),
          this.hasCurrentRole$,
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.setDialog('edit'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ROLE_EDIT'),
          this.hasCurrentRole$,
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ROLE_DELETE'),
          this.hasCurrentRole$,
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.permissionsService.fetchRoles(),
        enabled: this.userPermissionsService.has('ROLE_VIEW')
      },
    ]
  };

  columns: ISimpleGridColumn<IPermissionRole>[] = [
    { prop: 'id', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'comment', width: 200 },
  ].map(addGridLabel('roles.permissions.grid'));

  dialog: 'add' | 'copy' | 'edit' | 'remove';

  hasRoleViewPermission$: Observable<boolean>;

  emptyMessage$: Observable<string>;

  private permissionsServiceSubscription: Subscription;
  private hasViewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private notifications: NotificationsService,
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.permissionsServiceSubscription = this.permissionsService.permissions
      .subscribe(state => {
        this.editedEntity = state.currentRole;
        this.cdRef.markForCheck();
      });

    this.roles$ = this.permissionsService.permissions.map(state => state.roles);

    this.hasRoleViewPermission$ = this.userPermissionsService.has('ROLE_VIEW');

    this.hasViewPermissionSubscription = this.hasRoleViewPermission$
      .subscribe(canView =>
        canView
          ? this.permissionsService.fetchRoles()
          : this.permissionsService.clearRoles()
      );

    this.emptyMessage$ = this.hasRoleViewPermission$
      .map(canView => canView ? null : 'roles.roles.errors.view');
  }

  ngOnDestroy(): void {
    this.permissionsServiceSubscription.unsubscribe();
    this.hasViewPermissionSubscription.unsubscribe();
  }

  onDblClick(): void {
    this.userPermissionsService.has('ROLE_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        if (canEdit) {
          this.setDialog('edit');
        } else {
          this.notifications.error('roles.roles.errors.edit').dispatch();
        }
        this.cdRef.markForCheck();
      });
  }

  onSelect(roles: IPermissionRole[]): void {
    if (!isEmpty(roles)) {
      this.permissionsService.selectRole(roles[0]);
    }
  }

  onAdd(data: any): void {
    this.permissionsService.createRole(data);
    this.onSuccess(PermissionsService.ROLE_ADD_SUCCESS);
  }

  onEdit(data: any): void {
    this.permissionsService.updateRole(data);
    this.onSuccess(PermissionsService.ROLE_UPDATE_SUCCESS);
  }

  onCopy(data: any): void {
    const { originalRoleId, ...role } = data;
    this.permissionsService.copyRole(originalRoleId, role);
    this.onSuccess(PermissionsService.ROLE_COPY_SUCCESS);
  }

  onRemove(): void {
    this.permissionsService.removeRole();
    this.onSuccess(PermissionsService.ROLE_DELETE_SUCCESS);
  }

  cancelAction(): void {
    this.setDialog();
    this.cdRef.markForCheck();
  }

  private onSuccess(type: string): void {
    this.permissionsService.getAction(type)
      .pipe(first())
      .subscribe(_ => {
        this.setDialog();
        this.cdRef.markForCheck();
      });
  }
}
