import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/zip';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IPermissionsDialogEnum, IPermissionsState } from '../permissions.interface';
import { IPermissionModel, IPermissionRole } from '../permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
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
      action: () => this.onBeforeAddPermissions(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PERMIT_ADD'),
        this.permissionsService.permissions.map(state => !!state.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dialogAction(IPermissionsDialogEnum.PERMISSION_EDIT),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PERMIT_EDIT'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction(IPermissionsDialogEnum.PERMISSION_DELETE),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PERMIT_DELETE'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.permissionsService.fetchPermissions(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PERMIT_VIEW'),
        this.permissionsService.permissions.map(state => !!state.currentRole)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
  ];

  // TODO(d.maltsev): type
  permissions$: Observable<Array<any>>;

  canViewPermissions$: Observable<boolean>;

  emptyMessage$: Observable<string>;
  availablePermissions: IPermissionModel[];

  dialog: IPermissionsDialogEnum;

  private currentPermission: IPermissionModel;
  private currentRole: IPermissionRole;
  private permissionsSubscription: Subscription;
  private viewPermissionsSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.permissionsSubscription = this.permissionsService.permissions
      .subscribe(
        (permissions: IPermissionsState) => {
          this.currentRole = permissions.currentRole;
          this.currentPermission = permissions.currentPermission;
          this.dialog = permissions.dialog;
        }
      );

    this.permissions$ = this.permissionsService.permissions
      .map(state => state.rawPermissions)
      .distinctUntilChanged()
      .map(permissions => this.valueConverterService.deserializeSet(permissions));

    this.canViewPermissions$ = this.userPermissionsService.has('PERMIT_VIEW');

    this.viewPermissionsSubscription = Observable.combineLatest(
      this.canViewPermissions$,
      this.permissionsService.permissions.map(permissions => permissions.currentRole).distinctUntilChanged()
    )
    .subscribe(([ hasViewPermission, currentRole ]) => {
      if (!hasViewPermission) {
        this.permissionsService.clearPremissions();
      } else if (currentRole) {
        this.permissionsService.fetchPermissions();
      }
    });

    this.emptyMessage$ = this.canViewPermissions$.map(hasPermission => hasPermission ? null : 'roles.permissions.errors.view');
  }

  ngOnDestroy(): void {
    this.permissionsSubscription.unsubscribe();
    this.viewPermissionsSubscription.unsubscribe();
  }

  onBeforeAddPermissions(): void {
    this.gridService
      .read('/roles/{id}/permits/notadded', { id: this.currentRole.id })
      .subscribe(data => {
        this.availablePermissions = data.permits;
        this.dialogAction(IPermissionsDialogEnum.PERMISSION_ADD);
      });
  }

  onBeforeEditPermission(): void {
    this.userPermissionsService.has('PERMIT_EDIT')
      .take(1)
      .subscribe(hasPermission => {
        if (hasPermission && this.currentPermission) {
          this.dialogAction(IPermissionsDialogEnum.PERMISSION_EDIT);
        }
      });
  }

  onSelectPermissions(record: IPermissionModel): void {
    if (record) {
      this.permissionsService.changeSelected(record);
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
