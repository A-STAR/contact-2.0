import { Component } from '@angular/core';

import { IAppState } from '../../../../core/state/state.interface';
import { IPermissionsDialogEnum } from '../../../../core/permissions/permissions.interface';
import { IPermissionRole } from '../roles-and-permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PermissionsService } from '../../../../core/permissions/permissions.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  editedEntity: IPermissionRole = null;

  dialog: IPermissionsDialogEnum = null;

  rows: Array<IPermissionRole>;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      permissions: [ 'ROLE_ADD' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_ADD)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-clone',
      label: 'toolbar.action.copy',
      permissions: [ 'ROLE_COPY' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_COPY),
      disabled: this.permissionsService.permissions.map(permissions => !permissions.currentRole)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      permissions: [ 'ROLE_EDIT' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_EDIT),
      disabled: this.permissionsService.permissions.map(permissions => !permissions.currentRole)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      permissions: [ 'ROLE_DELETE' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_DELETE),
      disabled: this.permissionsService.permissions.map(permissions => !permissions.currentRole)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      permissions: [ 'PERMIT_VIEW' ],
      action: () => this.permissionsService.fetchRoles()
    },
  ];

  columns: Array<any> = [
    { prop: 'id', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'comment', width: 200 },
  ];

  constructor(
    private permissionsService: PermissionsService,
  ) {
    this.permissionsService.fetchRoles();

    this.permissionsService.permissions.subscribe(state => {
      this.rows = state.roles;
      this.dialog = state.dialog;
      this.editedEntity = state.currentRole;
    });
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
