import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../core/state/state.interface';
import {
  IPermission,
  IPermissionModel,
  IPermissionRole,
  IPermissionsDialogEnum,
  IPermissionsState,
  IValueEntity,
  IRawPermission,
  IPermissionsResponse,
} from './permissions.interface';

import { GridService } from '../../shared/components/grid/grid.service';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';
  // store actions
  static PERMISSION_FETCH               = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS       = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_ADD                 = 'PERMISSION_ADD';
  static PERMISSION_UPDATE              = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE              = 'PERMISSION_DELETE';
  static PERMISSION_DIALOG              = 'PERMISSION_DIALOG';
  static PERMISSION_SELECTED_PERMISSION = 'PERMISSION_SELECTED_PERMISSION';
  static PERMISSION_SELECTED_ROLE       = 'PERMISSION_SELECTED_ROLE';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  get permissions(): Observable<IPermissionsState> {
    return this.store.select('permissions');
  }

  resolvePermissions(): Observable<IPermission> {
    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        return this.normalizePermissions(response);
      })
      .do((payload: IPermission) =>
        this.store.dispatch({ type: PermissionsService.PERMISSION_FETCH_SUCCESS, payload })
      );
  }

  hasPermission(permissionName: string | Array<string>): Observable<boolean> {
    const state = this.permissions
      .map(permissions => permissions.permissions);

    if (Array.isArray(permissionName)) {
      return state
        .map(permissions => {
          return permissionName.reduce((acc, permission) => {
            return acc && permissions[permission];
          }, true);
        });
    }
    return state.map(permissions => !!permissions[permissionName]);
  }

  hasAllPermissions(permissionNames: Array<string>): Observable<boolean> {
    return this.permissions
      .map(slice => slice.permissions)
      .map(permissions => {
        return permissionNames.reduce((acc, permission) => {
          return acc && permissions[permission];
        }, true);
      });
  }

  valueToBoolean(rawPermission: IRawPermission): boolean {
    return (rawPermission.valueB !== null) ? !!rawPermission.valueB : false;
  }

  addPermission(role: IPermissionRole, permissionIds: number[]): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_ADD,
      payload: { role, permissionIds },
    });
  }

  removePermission(role: IPermissionRole, permissionId: number): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_DELETE,
      payload: { role, permissionId },
    });
  }

  updatePermission(roleId: number, permission: IValueEntity): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_UPDATE,
      payload: { roleId, permission },
    });
  }

  permissionDialog(payload: IPermissionsDialogEnum): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_DIALOG, payload });
  }

  changeSelected(payload: IPermissionModel): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_SELECTED_PERMISSION, payload });
  }

  normalizePermissions(response: IPermissionsResponse): IPermission {
    return response.userPermits.reduce((acc, rawPermission: IRawPermission) => {
      acc[rawPermission.name] = this.valueToBoolean(rawPermission);
      return acc;
    }, {});
  }

}
