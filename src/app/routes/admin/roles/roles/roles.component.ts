import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IPermissionsDialogEnum } from '../../../../core/permissions/permissions.interface';
import { IPermissionRole } from '../roles-and-permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PermissionsService } from '../../../../core/permissions/permissions.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnDestroy {
  editedEntity: IPermissionRole = null;

  dialog: IPermissionsDialogEnum = null;

  rows: Array<IPermissionRole>;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_ADD),
      enabled: this.permissionsService.hasPermission('ROLE_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-clone',
      label: 'toolbar.action.copy',
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_COPY),
      enabled: Observable.combineLatest(
        this.permissionsService.hasPermission('ROLE_COPY'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_EDIT),
      enabled: Observable.combineLatest(
        this.permissionsService.hasPermission('ROLE_EDIT'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_DELETE),
      enabled: Observable.combineLatest(
        this.permissionsService.hasPermission('ROLE_DELETE'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.permissionsService.fetchRoles(),
      enabled: this.permissionsService.hasPermission('PERMIT_VIEW')
    },
  ];

  columns: Array<any> = [
    { prop: 'id', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'comment', width: 200 },
  ];

  private permissionsServiceSub: Subscription;

  constructor(
    private permissionsService: PermissionsService,
  ) {
    this.permissionsService.fetchRoles();

    this.permissionsServiceSub = this.permissionsService.permissions.subscribe(state => {
      this.rows = state.roles;
      this.dialog = state.dialog;
      this.editedEntity = state.currentRole;
    });
  }

  ngOnDestroy(): void {
    this.permissionsServiceSub.unsubscribe();
  }

  get isRoleBeingCreated(): boolean {
    return this.dialog === IPermissionsDialogEnum.ROLE_ADD;
  }

  get isRoleBeingEdited(): boolean {
    return this.dialog === IPermissionsDialogEnum.ROLE_EDIT;
  }

  get isRoleBeingCopied(): boolean {
    return this.dialog === IPermissionsDialogEnum.ROLE_COPY;
  }

  get isRoleBeingRemoved(): boolean {
    return this.dialog === IPermissionsDialogEnum.ROLE_DELETE;
  }

  onEdit(): void {
    this.permissionsService.permissionDialog(IPermissionsDialogEnum.ROLE_EDIT);
  }

  onSelectedRowChange(roles: Array<IPermissionRole>): void {
    const role = roles[0];
    if (role) {
      this.permissionsService.selectRole(role);
    }
  }

  onAddSubmit(data: any): void {
    this.permissionsService.createRole(data);
  }

  onEditSubmit(data: any): void {
    this.permissionsService.updateRole(data);
  }

  onCopySubmit(data: any): void {
    const { originalRoleId, ...role } = data;
    this.permissionsService.copyRole(originalRoleId[0].value, role);
  }

  onRemoveSubmit(): void {
    this.permissionsService.removeRole();
  }

  cancelAction(): void {
    this.permissionsService.permissionDialog(IPermissionsDialogEnum.NONE);
  }

  private dialogAction(dialog: IPermissionsDialogEnum): void {
    this.permissionsService.permissionDialog(dialog);
  }
}
