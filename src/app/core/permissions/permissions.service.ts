import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../shared/components/grid/grid.service';
import { IPermission, IPermissionsResponse } from './permissions.interface';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';

  private userPermissions: Map<string, boolean> = new Map<string, boolean>();

  constructor(private gridService: GridService) {
  }

  public getUserPermissions(forceReload?: boolean): Observable<Map<String, boolean>> {
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

  public hasOnePermission(permissionNames: string | Array<string>): boolean {
    const permissions = Array.isArray(permissionNames) ? permissionNames : [ permissionNames ];
    return permissions.reduce((acc, permission) => {
      return acc || !!this.userPermissions.get(permission);
    }, false);
  }

  public hasPermission(permissionName: string): boolean {
    // get can return undefined
    return !!this.userPermissions.get(permissionName);
  }

  public hasAllPermissions(permissionNames: Array<string>): boolean {
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
