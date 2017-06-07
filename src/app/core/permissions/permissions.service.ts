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

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  get state(): Observable<IPermissionsState> {
    return this.store.select(state => state.permissions);
  }

  resolvePermissions(): Observable<IPermissionsState> {
    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        return response.userPermits.reduce((acc, userPermission: IPermission) => {
          acc[userPermission.name] = this.valueToBoolean(userPermission);
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
        }, true);
      });
    }
    return this.state.map(permissions => !!permissions[permissionName]);
  }

  hasAllPermissions(permissionNames: Array<string>): Observable<boolean> {
    return this.state.map(permissions => {
      return permissionNames.reduce((acc, permission) => {
        return acc && permissions[permission];
      }, true);
    });
  }

  valueToBoolean(userPermission: IPermission): boolean {
    return (userPermission.valueB !== null) ? userPermission.valueB : false;
  }

  addPermission(permissionId: number, permission: IPermission): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_CREATE,
      payload: { permissionId, permission },
    });
  }
}
