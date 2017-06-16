import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../../core/state/state.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IPermissionsDialogEnum, IPermissionsState } from '../../../../core/permissions/permissions.interface';
import { IPermissionModel, IPermissionRole } from '../roles-and-permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent implements OnDestroy {

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 70, maxWidth: 100 },
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'value', minWidth: 70, maxWidth: 100, localized: true },
    { prop: 'dsc', minWidth: 200 },
    { prop: 'comment', minWidth: 300 },
  ];

  renderers: IRenderer = {
    value: (permission: IPermissionModel) => this.valueConverterService.deserializeBoolean(permission)
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      permissions: [ 'PERMIT_ADD' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.PERMISSION_ADD),
      disabled: (state: IAppState) => !state.permissions.currentRole,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      permissions: [ 'PERMIT_EDIT' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.PERMISSION_EDIT),
      disabled: (state: IAppState) => !state.permissions.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      permissions: [ 'PERMIT_DELETE' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.PERMISSION_DELETE),
      disabled: (state: IAppState) => !state.permissions.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      permissions: [ 'PERMIT_VIEW' ],
      action: () => this.permissionsService.fetchPermissions(),
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles/{id}/permits',
    dataKey: 'permits'
  };

  // data for the grid
  rawPermissions: Array<any> = [];

  dialog: IPermissionsDialogEnum;

  private currentPermission: IPermissionModel;
  private currentRole: IPermissionRole;
  private permissionsSub: Subscription;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private permissionsService: PermissionsService,
    private valueConverterService: ValueConverterService
  ) {
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.permissionsSub = this.permissionsService.permissions
        .subscribe(
          (permissions: IPermissionsState) => {
            this.currentRole = permissions.currentRole;
            this.currentPermission = permissions.currentPermission;
            this.dialog = permissions.dialog;
            this.rawPermissions = this.valueConverterService.deserializeSet(permissions.rawPermissions);
          }
        );
  }

  ngOnDestroy(): void {
    this.permissionsSub.unsubscribe();
  }

  onBeforeEditPermission(): void {
    if (!this.currentPermission) {
      return;
    }

    this.dialogAction(IPermissionsDialogEnum.PERMISSION_EDIT);
  }

  onSelectPermissions(records: IPermissionModel[]): void {
    if (records.length) {
      this.permissionsService.changeSelected(records[0]);
    }
  }

  onAfterEditPermission(permission: IPermissionModel): void {
    this.permissionsService.updatePermission(
      this.currentRole.id,
      this.valueConverterService.serialize(permission)
    );
  }

  onCancel(): void {
    this.dialogAction(IPermissionsDialogEnum.NONE);
  }

  onAddPermissions(addedPermissions: IPermissionModel[]): void {
    const permissionsIds: number[] = addedPermissions.map((rec: IPermissionModel) => rec.id);
    this.permissionsService.addPermission(this.currentRole, permissionsIds);
  }

  onRemovePermission(): void {
    const permissionId: number = this.currentPermission.id;
    this.permissionsService.removePermission(this.currentRole, permissionId);
  }

  isDialog(dialog: IPermissionsDialogEnum): boolean {
    return this.dialog === dialog;
  }

  private dialogAction(dialog: IPermissionsDialogEnum): void {
    this.permissionsService.permissionDialog(dialog);
  }
}
