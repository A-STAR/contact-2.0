import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';

import { IPermissionModel, IPermissionRole } from '../permissions.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';
import { IValueEntity } from '@app/core/converter/value-converter.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent extends DialogFunctions implements OnInit, OnDestroy {

  availablePermissions: IPermissionModel[];
  canViewPermissions$: Observable<boolean>;
  currentPermission: IPermissionModel;
  permissions$: Observable<IValueEntity[]>;

  emptyMessage$: Observable<string>;

  dialog: 'add' | 'edit' | 'remove';

  columns: ISimpleGridColumn<IPermissionModel>[] = [
    { prop: 'id', minWidth: 70, maxWidth: 100 },
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'value', minWidth: 70, maxWidth: 100, valueTypeKey: 'typeCode' },
    { prop: 'dsc', minWidth: 200 },
    { prop: 'comment', minWidth: 300 },
  ].map(addGridLabel('roles.permissions.grid'));

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      action: () => this.onBeforeAdd(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_ADD'),
        this.permissionsService.permissions.map(state => !!state.currentRole)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.setDialog('edit'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_EDIT'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('PERMIT_DELETE'),
        this.permissionsService.permissions.map(state => !!state.currentPermission)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
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
    private notifications: NotificationsService,
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
    super();
  }

  ngOnInit(): void {
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

  onSelect(records: IPermissionModel[]): void {
    const record = isEmpty(records)
      ? null
      : records[0];
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
