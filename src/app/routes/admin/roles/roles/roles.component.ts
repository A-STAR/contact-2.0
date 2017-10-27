import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IPermissionsDialogEnum } from '../permissions.interface';
import { IPermissionRole } from '../permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnDestroy {
  editedEntity: IPermissionRole = null;

  dialog: IPermissionsDialogEnum = null;

  roles$: Observable<Array<IPermissionRole>>;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_ADD),
      enabled: this.userPermissionsService.has('ROLE_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_COPY,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_COPY),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ROLE_COPY'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_EDIT),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ROLE_EDIT'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction(IPermissionsDialogEnum.ROLE_DELETE),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ROLE_DELETE'),
        this.permissionsService.permissions.map(permissions => !!permissions.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.permissionsService.fetchRoles(),
      enabled: this.userPermissionsService.has('ROLE_VIEW')
    },
  ];

  columns: Array<any> = [
    { prop: 'id', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'comment', width: 200 },
  ];

  hasRoleViewPermission$: Observable<boolean>;

  emptyMessage$: Observable<string>;

  private permissionsServiceSubscription: Subscription;
  private hasViewPermissionSubscription: Subscription;

  constructor(
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.permissionsServiceSubscription = this.permissionsService.permissions.subscribe(state => {
      this.dialog = state.dialog;
      this.editedEntity = state.currentRole;
    });

    this.roles$ = this.permissionsService.permissions.map(state => state.roles);

    this.hasRoleViewPermission$ = this.userPermissionsService.has('ROLE_VIEW');
    this.hasViewPermissionSubscription = this.hasRoleViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.permissionsService.fetchRoles() : this.permissionsService.clearRoles()
    );

    this.emptyMessage$ = this.hasRoleViewPermission$.map(hasPermission => hasPermission ? null : 'roles.roles.errors.view');
  }

  ngOnDestroy(): void {
    this.permissionsServiceSubscription.unsubscribe();
    this.hasViewPermissionSubscription.unsubscribe();
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
    this.userPermissionsService.has('ROLE_EDIT')
      .take(1)
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          this.permissionsService.permissionDialog(IPermissionsDialogEnum.ROLE_EDIT);
        }
      });
  }

  onSelect(role: IPermissionRole): void {
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
