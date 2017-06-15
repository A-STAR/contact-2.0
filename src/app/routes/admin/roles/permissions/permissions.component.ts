import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IPermissionsDialogEnum, IPermissionsState } from '../../../../core/permissions/permissions.interface';
import { IPermissionModel, IPermissionRole, IPermissionsResponse } from './permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent implements OnChanges, OnDestroy {

  dialog: IPermissionsDialogEnum;
  private currentPermission: IPermissionModel;
  private permissionsSub: Subscription;

  @ViewChild(GridComponent) permitsGrid: GridComponent;
  @Input() currentRole: IPermissionRole;

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
      // permissions: [ 'PERMIT_ADD' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ADD),
      // disabled: () => !this.currentRole,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      // permissions: [ 'PERMIT_EDIT' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.EDIT),
      // disabled: () => !this.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      // permissions: [ 'PERMIT_DELETE' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.DELETE),
      // disabled: () => !this.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      // permissions: [ 'PERMIT_VIEW' ],
      action: () => this.refreshGrid(),
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles/{id}/permits',
    dataKey: 'permits'
  };

  // data for the grid
  rawPermissions: Array<any> = [];

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
          this.currentPermission = permissions.currentPermission;
          this.dialog = permissions.dialog;
        }
      );
  }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    this.refreshGrid();
  }

  ngOnDestroy(): void {
    this.permissionsSub.unsubscribe();
  }

  onBeforeEditPermission(): void {
    if (!this.currentPermission) {
      return;
    }

    this.dialogAction(IPermissionsDialogEnum.EDIT);
  }

  onSelectPermissions(records: IPermissionModel[]): void {
    if (records.length) {
      this.changeSelectedPermission(records[0]);
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

  // private loadGrid(currentRole: IPermissionRole): void {
  //   this.permitsGrid.load(currentRole)
  //     .take(1)
  //     .subscribe(
  //       () => {},
  //       err => this.notificationsService.error('permissions.api.errors.fetch')
  //     );
  // }

  private refreshGrid(): void {
    if (!this.permitsGrid) {
      return;
    }

    if (this.currentRole) {
      this.gridService
        .read(this.dataSource.read, this.currentRole)
        .map(data => this.parseFn(data))
        .take(1)
        .subscribe(
          rawPermissions => {
            this.rawPermissions = rawPermissions;
            // this.permitsGrid.cdRef.detectChanges();
            this.permitsGrid.updateRows(rawPermissions);
            this.changeSelectedPermission(null);
          },
          err => this.notificationsService.error('permissions.api.errors.fetch')
        );
    } else {
      this.rawPermissions = [];
      this.permitsGrid.clear();
    }
  }

  private dialogAction(dialog: IPermissionsDialogEnum): void {
    this.permissionsService.permissionDialog(dialog);
  }

  private changeSelectedPermission(currentPermission: IPermissionModel): void {
    this.permissionsService.changeSelected(currentPermission);
  }

}
