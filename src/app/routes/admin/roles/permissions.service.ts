import { Actions } from '@ngrx/effects';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../core/state/state.interface';
import {
  IPermissionModel, IPermissionRole,
  IPermissionsState, IValueEntity
} from './permissions.interface';

import { AbstractActionService } from '../../../core/state/action.service';

@Injectable()
export class PermissionsService extends AbstractActionService {
  static STORAGE_KEY = 'state/permissions';

  // store actions
  static ROLE_INIT                  = 'ROLE_INIT';
  static ROLE_FETCH                 = 'ROLE_FETCH';
  static ROLE_FETCH_SUCCESS         = 'ROLE_FETCH_SUCCESS';
  static ROLE_ADD                   = 'ROLE_ADD';
  static ROLE_ADD_SUCCESS           = 'ROLE_ADD_SUCCESS';
  static ROLE_UPDATE                = 'ROLE_UPDATE';
  static ROLE_UPDATE_SUCCESS        = 'ROLE_UPDATE_SUCCESS';
  static ROLE_COPY                  = 'ROLE_COPY';
  static ROLE_COPY_SUCCESS          = 'ROLE_COPY_SUCCESS';
  static ROLE_DELETE                = 'ROLE_DELETE';
  static ROLE_DELETE_SUCCESS        = 'ROLE_DELETE_SUCCESS';
  static ROLE_SELECTED              = 'ROLE_SELECTED';
  static ROLE_CLEAR                 = 'ROLE_CLEAR';
  static PERMISSION_FETCH           = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS   = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_CLEAR           = 'PERMISSION_CLEAR';
  static PERMISSION_ADD             = 'PERMISSION_ADD';
  static PERMISSION_ADD_SUCCESS     = 'PERMISSION_ADD_SUCCESS';
  static PERMISSION_UPDATE          = 'PERMISSION_UPDATE';
  static PERMISSION_UPDATE_SUCCESS  = 'PERMISSION_UPDATE_SUCCESS';
  static PERMISSION_DELETE          = 'PERMISSION_DELETE';
  static PERMISSION_DELETE_SUCCESS  = 'PERMISSION_DELETE_SUCCESS';
  static PERMISSION_SELECTED        = 'PERMISSION_SELECTED';

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>
  ) {
    super();
  }

  get permissions(): Observable<IPermissionsState> {
    return this.store.select(state => state.permissions)
      .filter(Boolean);
  }

  get roles(): Observable<IPermissionRole[]> {
    return this.permissions.map(state => state.roles)
      .pipe(distinctUntilChanged());
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

  changeSelected(payload: IPermissionModel): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_SELECTED, payload });
  }
}
