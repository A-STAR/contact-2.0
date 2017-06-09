import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../core/state/state.interface';
import {
  IPermission,
  IPermissionRole,
  IValueEntity,
  IRawPermission,
  IPermissionsResponse,
  IPermissionsState,
} from './permissions.interface';

import { GridService } from '../../shared/components/grid/grid.service';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';
  // store actions
  static PERMISSION_FETCH         = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_ADD           = 'PERMISSION_ADD';
  static PERMISSION_UPDATE        = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE        = 'PERMISSION_DELETE';
  static PERMISSION_DIALOG        = 'PERMISSION_DIALOG';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  get permissions(): Observable<IPermission> {
    return this.store.select(state => state.permissions)
      .map(slice => slice.permissions);
  }

  resolvePermissions(): Observable<IPermissionsState> {
    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        return response.userPermits.reduce((acc, userPermission: IRawPermission) => {
          acc[userPermission.name] = this.valueToBoolean(userPermission);
          return acc;
        }, {});
      })
      .do((payload: IPermission) =>
        this.store.dispatch({ type: PermissionsService.PERMISSION_FETCH_SUCCESS, payload })
      );
  }

  hasPermission(permissionName: string | Array<string>): Observable<boolean> {
    if (Array.isArray(permissionName)) {
      return this.permissions
        .map(permissions => {
          return permissionName.reduce((acc, permission) => {
            return acc && permissions[permission];
          }, true);
        });
    }
    return this.permissions.map(permissions => !!permissions[permissionName]);
  }

  hasAllPermissions(permissionNames: Array<string>): Observable<boolean> {
    return this.permissions
      .map(permissions => {
        return permissionNames.reduce((acc, permission) => {
          return acc && permissions[permission];
        }, true);
      });
  }

  valueToBoolean(userPermission: IRawPermission): boolean {
    return (userPermission.valueB !== null) ? userPermission.valueB : false;
  }

  addPermission(role: IPermissionRole, permissionIds: number[]): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_ADD,
      payload: { role,  permissionIds },
    });
  }

  removePermission(role: IPermissionRole, permissionId: number): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_DELETE,
      payload: { role, permissionId },
    });
  }

  updatePermission(roleId: number, permissionId: number, permission: IValueEntity): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_UPDATE,
      payload: { roleId, permissionId, permission },
    });
  }

  permissionDialodAction(payload: { dialog: any; currentPermission: any }): void {
    this.store.dispatch({ type: PermissionsService.PERMISSION_DIALOG, payload });
  }

}
