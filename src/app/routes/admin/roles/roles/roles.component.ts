import { Component } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IAppState } from '../../../../core/state/state.interface';
import { IPermissionsDialogEnum } from '../../../../core/permissions/permissions.interface';
import { IRole } from './roles.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PermissionsService } from '../../../../core/permissions/permissions.service';

// import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  editedEntity: IRole = null;

  dialog: IPermissionsDialogEnum = null;

  // TODO(d.maltsev): role row type
  rows: Array<any>;

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
      disabled: (state: IAppState) => !state.permissions.currentRole
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      permissions: [ 'ROLE_EDIT' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_EDIT),
      disabled: (state: IAppState) => !state.permissions.currentRole
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      permissions: [ 'ROLE_DELETE' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_DELETE),
      disabled: (state: IAppState) => !state.permissions.currentRole
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      permissions: [ 'PERMIT_VIEW' ],
      action: () => this.permissionsService.fetchRoles()
    },
  ];

  // TODO(d.maltsev): new toolbar config
  // toolbarItems: Array<IToolbarItem> = [
  //   {
  //     type: ToolbarItemTypeEnum.BUTTON_ADD,
  //     action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_ADD),
  //     disabled: this.permissionsService.hasPermission('ROLE_ADD').map(hasPermission => !hasPermission)
  //   },
  //   {
  //     type: ToolbarItemTypeEnum.BUTTON_EDIT,
  //     action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_EDIT),
  //     disabled: Observable.combineLatest(
  //       this.permissionsService.hasPermission('ROLE_EDIT'),
  //       this.permissionsService.permissions.map(state => state.currentRole)
  //     // TODO(d.maltsev): rename
  //     ).map(data => !data[0] || !data[1])
  //   },
  //   {
  //     type: ToolbarItemTypeEnum.BUTTON_DELETE,
  //     action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_DELETE),
  //     disabled: Observable.combineLatest(
  //       this.permissionsService.hasPermission('ROLE_DELETE'),
  //       this.permissionsService.permissions.map(state => state.currentRole)
  //     // TODO(d.maltsev): rename
  //     ).map(data => !data[0] || !data[1])
  //   },
  //   {
  //     type: ToolbarItemTypeEnum.BUTTON_REFRESH,
  //     action: () => this.permissionsService.fetchRoles(),
  //     disabled: this.permissionsService.hasPermission('PERMIT_VIEW').map(hasPermission => !hasPermission)
  //   },
  // ];

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

  onSelectedRowChange(roles: Array<IRole>): void {
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
