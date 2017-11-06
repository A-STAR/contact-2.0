import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../../core/state/state.interface';
import {
  IPermissionModel, IPermissionRole, IPermissionsDialogEnum,
  IPermissionsState, IValueEntity
} from './permissions.interface';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';

  // store actions
  static ROLE_FETCH               = 'ROLE_FETCH';
  static ROLE_FETCH_SUCCESS       = 'ROLE_FETCH_SUCCESS';
  static ROLE_ADD                 = 'ROLE_ADD';
  static ROLE_UPDATE              = 'ROLE_UPDATE';
  static ROLE_COPY                = 'ROLE_COPY';
  static ROLE_DELETE              = 'ROLE_DELETE';
  static ROLE_SELECTED            = 'ROLE_SELECTED';
  static ROLE_CLEAR               = 'ROLE_CLEAR';
  static PERMISSION_FETCH         = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_CLEAR         = 'PERMISSION_CLEAR';
  static PERMISSION_ADD           = 'PERMISSION_ADD';
  static PERMISSION_UPDATE        = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE        = 'PERMISSION_DELETE';
  static PERMISSION_SELECTED      = 'PERMISSION_SELECTED';
  static PERMISSION_DIALOG        = 'PERMISSION_DIALOG';

  constructor(private store: Store<IAppState>) {}

  get permissions(): Observable<IPermissionsState> {
    return this.store.select(state => state.permissions)
      .filter(Boolean);
  }

  get roles(): Observable<IPermissionRole[]> {
    return this.permissions.map(state => state.roles)
      .distinctUntilChanged();
  }

  fetchRoles(): void {
    this.store.dispatch({
      type: PermissionsService.ROLE_FETCH
    });
  }

  selectRole(role: IPermissionRole): void {
    this.store.dispatch({
      type: PermissionsService.ROLE_SELECTED,
      payload: { role }
    });
  }

  createRole(role: IPermissionRole): void {
    return this.store.dispatch({
      type: PermissionsService.ROLE_ADD,
      payload: {
        role
      }
    });
  }

  updateRole(role: IPermissionRole): void {
    return this.store.dispatch({
      type: PermissionsService.ROLE_UPDATE,
      payload: {
        role
      }
    });
  }

  copyRole(originalRoleId: number, role: IPermissionRole): void {
    return this.store.dispatch({
      type: PermissionsService.ROLE_COPY,
      payload: {
        originalRoleId,
        role
      }
    });
  }

  removeRole(): void {
    return this.store.dispatch({
      type: PermissionsService.ROLE_DELETE
    });
  }

  clearRoles(): void {
    return this.store.dispatch({
      type: PermissionsService.ROLE_CLEAR
    });
  }

  fetchPermissions(): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_FETCH
    });
  }

  addPermission(role: IPermissionRole, permissionIds: number[]): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_ADD,
      payload: { role, permissionIds },
    });
  }

  updatePermission(roleId: number, permission: IValueEntity): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_UPDATE,
      payload: { roleId, permission },
    });
  }

  removePermission(role: IPermissionRole, permissionId: number): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_DELETE,
      payload: { role, permissionId },
    });
  }

  clearPermissions(): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_CLEAR
    });
  }

  permissionDialog(payload: IPermissionsDialogEnum): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_DIALOG, payload });
  }

  changeSelected(payload: IPermissionModel): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_SELECTED, payload });
  }
}
