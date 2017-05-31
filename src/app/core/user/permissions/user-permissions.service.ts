import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../shared/components/grid/grid.service';
import { IUserPermissionModel, IUserPermissionsResponse } from './user-permissions.interface';

@Injectable()
export class UserPermissionsService {

  private userPermissions: Map<string, boolean> = new Map<string, boolean>();

  constructor(private gridService: GridService) {
  }

  public getUserPermissions(forceReload?: boolean): Observable<Map<String, boolean>> {
    if (this.userPermissions.size > 0 && !forceReload) {
      return Observable.of(this.userPermissions);
    }

    return this.gridService.read('/api/userpermits')
      .map((response: IUserPermissionsResponse) => {
        response.userPermits.forEach((userPermission: IUserPermissionModel) => {
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

  private toUserPermissionValue(userPermissionModel: IUserPermissionModel): boolean {
    if (userPermissionModel.valueB !== null) {
      return userPermissionModel.valueB;
    } else if (userPermissionModel.valueN !== null) {
      return !!userPermissionModel.valueN;
    } else if (userPermissionModel.valueS !== null) {
      return !!parseInt(userPermissionModel.valueS, 10);
    }
    return false;
  }
}
