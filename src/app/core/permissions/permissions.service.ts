import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../core/state/state.interface';
import { IPermission, IPermissionsResponse, IPermissionsState } from './permissions.interface';

import { GridService } from '../../shared/components/grid/grid.service';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';
  // store actions
  static PERMISSION_FETCH = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_CREATE = 'PERMISSION_CREATE';
  static PERMISSION_UPDATE = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE = 'PERMISSION_DELETE';
  static PERMISSION_INVALIDATE = 'PERMISSION_INVALIDATE';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  get state(): Observable<IPermissionsState> {
    return this.store.select(state => state.permissions);
  }

  resolvePermissions(forceReload?: boolean): Observable<IPermissionsState> {
    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        return response.userPermits.reduce((acc, userPermission: IPermission) => {
          acc[userPermission.name] = this.toPermissionValue(userPermission);
          return acc;
        }, {});
      })
      .do(payload => this.store.dispatch({ type: PermissionsService.PERMISSION_FETCH_SUCCESS, payload }));
  }

  hasPermission2(permissionName: string | Array<string>): Observable<boolean> {
    return this.hasPermission(permissionName);
  }

  hasPermission(permissionName: string | Array<string>): Observable<boolean> {
    if (Array.isArray(permissionName)) {
      return this.state.map(permissions => {
        return permissionName.reduce((acc, permission) => {
          return acc && permissions[permission];
        }, false);
      });
    }
    return this.state.map(permissions => !!permissions[permissionName]);
  }

  hasAllPermissions(permissionNames: Array<string>): Observable<boolean> {
    return this.state.map(permissions => {
      return permissionNames.reduce((acc, permission) => {
        return acc && permissions[permission];
      }, false);
    });
  }

  toPermissionValue(userPermission: IPermission): boolean {
    return (userPermission.valueB !== null) ? userPermission.valueB : false;
  }

  addPermission(permission: string): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_CREATE,
      payload: permission,
    });
  }
}
