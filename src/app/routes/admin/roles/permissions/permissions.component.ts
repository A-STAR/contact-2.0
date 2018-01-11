import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IPermissionModel, IPermissionRole } from '../permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { IValueEntity } from '../../../../core/converter/value-converter.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-permissions',
  styleUrls: [ './permissions.component.scss' ],
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent extends DialogFunctions implements OnInit, OnDestroy {

  availablePermissions: IPermissionModel[];
  canViewPermissions$: Observable<boolean>;
  currentPermission: IPermissionModel;
  permissions$: Observable<IValueEntity[]>;

  emptyMessage$: Observable<string>;

  dialog: 'add' | 'edit' | 'remove';

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 70, maxWidth: 100 },
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'value', minWidth: 70, maxWidth: 100,
      renderer: (permission: IPermissionModel) => this.valueConverterService.deserializeBoolean(permission)
    },
    { prop: 'dsc', minWidth: 200 },
    { prop: 'comment', minWidth: 300 },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onBeforeAdd(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_ADD'),
        this.permissionsService.permissions.map(state => !!state.currentRole)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('edit'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_EDIT'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_DELETE'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.permissionsService.fetchPermissions(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_VIEW'),
        this.permissionsService.permissions.map(state => !!state.currentRole)
      ])
    },
  ];

  private currentRole: IPermissionRole;
  private permissionsSubscription: Subscription;
  private viewPermissionsSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.columns = this.gridService.setRenderers(this.columns);
    this.permissionsSubscription = this.permissionsService.permissions
      .subscribe(permissions => {
        this.currentRole = permissions.currentRole;
        this.currentPermission = permissions.currentPermission;
        this.cdRef.markForCheck();
      });

    this.permissions$ = this.permissionsService.permissions
      .map(state => state.permissions)
      .distinctUntilChanged()
      .map(permissions => this.valueConverterService.deserializeSet(permissions));

    this.canViewPermissions$ = this.userPermissionsService.has('PERMIT_VIEW');

    this.viewPermissionsSubscription = combineLatest(
      this.canViewPermissions$,
      this.permissionsService.permissions.map(permissions => permissions.currentRole).distinctUntilChanged()
    )
    .subscribe(([ canView, currentRole ]) => {
      if (!canView) {
        this.permissionsService.clearPermissions();
      } else if (currentRole) {
        this.permissionsService.fetchPermissions();
      }
    });

    this.emptyMessage$ = this.canViewPermissions$.map(canView => canView ? null : 'roles.permissions.errors.view');
  }

  ngOnDestroy(): void {
    this.permissionsSubscription.unsubscribe();
    this.viewPermissionsSubscription.unsubscribe();
  }

  onBeforeAdd(): void {
    this.dataService
      .readAll('/roles/{id}/permits/notadded', { id: this.currentRole.id })
      .subscribe(permits => {
        this.availablePermissions = permits;
        this.setDialog('add');
        this.cdRef.markForCheck();
      });
  }

  onDblClick(): void {
    this.userPermissionsService.has('PERMIT_EDIT')
      .pipe(first())
      .subscribe(canEdit => {
        if (canEdit) {
          if (this.currentPermission) {
            this.setDialog('edit');
            this.cdRef.markForCheck();
          }
        } else {
          this.notifications.error('roles.permissions.errors.edit').dispatch();
        }
      });
  }

  onEdit(permission: IPermissionModel): void {
    this.permissionsService.updatePermission(
      this.currentRole.id,
      this.valueConverterService.serialize(permission)
    );
    this.onSuccess(PermissionsService.PERMISSION_UPDATE_SUCCESS);
  }

  onSelect(record: IPermissionModel): void {
    if (record) {
      this.permissionsService.changeSelected(record);
    }
  }

  onAdd(addedPermissions: IPermissionModel[]): void {
    const permissionsIds: number[] = addedPermissions.map((rec: IPermissionModel) => rec.id);
    this.permissionsService.addPermission(this.currentRole, permissionsIds);
    this.onSuccess(PermissionsService.PERMISSION_ADD_SUCCESS);
  }

  onRemove(): void {
    const permissionId: number = this.currentPermission.id;
    this.permissionsService.removePermission(this.currentRole, permissionId);
    this.onSuccess(PermissionsService.PERMISSION_DELETE_SUCCESS);
  }

  onCancel(): void {
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
