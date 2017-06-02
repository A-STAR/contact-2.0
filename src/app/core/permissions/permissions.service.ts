import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../core/state/state.interface';
import { GridService } from '../../shared/components/grid/grid.service';
import { IPermission, IPermissionsResponse } from './permissions.interface';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';
  // store actions
  static PERMISSION_FETCH = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_FETCH_ERROR = 'PERMISSION_FETCH_ERROR';
  static PERMISSION_UPDATE = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE = 'PERMISSION_DELETE';
  static PERMISSION_INVALIDATE = 'PERMISSION_INVALIDATE';

  private userPermissions: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  getUserPermissions(forceReload?: boolean): Observable<Map<String, boolean>> {
    if (this.userPermissions.size && !forceReload) {
      return Observable.of(this.userPermissions);
    }

    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        response.userPermits.forEach((userPermission: IPermission) => {
          this.userPermissions.set(userPermission.name, this.toUserPermissionValue(userPermission));
        });
        return this.userPermissions;
      });
  }

  hasOnePermission(permissionNames: string | Array<string>): boolean {
    const permissions = Array.isArray(permissionNames) ? permissionNames : [ permissionNames ];
    return permissions.reduce((acc, permission) => {
      return acc || !!this.userPermissions.get(permission);
    }, false);
  }

  hasPermission(permissionName: string): boolean {
    // get can return undefined
    return !!this.userPermissions.get(permissionName);
  }

  hasAllPermissions(permissionNames: Array<string>): boolean {
    return permissionNames.reduce((acc, permission) => {
      return acc && this.userPermissions.get(permission);
    }, false);
  }

  private toUserPermissionValue(userPermission: IPermission): boolean {
    if (userPermission.valueB !== null) {
      return userPermission.valueB;
    } else if (userPermission.valueN !== null) {
      return !!userPermission.valueN;
    } else if (userPermission.valueS !== null) {
      return !!parseInt(userPermission.valueS, 10);
    }
    return false;
  }
}
