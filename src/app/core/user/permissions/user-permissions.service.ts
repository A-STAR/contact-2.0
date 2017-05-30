import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../shared/components/grid/grid.service';
import { IUserPermissionModel, IUserPermissionsResponse } from './user-permissions.interface';

@Injectable()
export class UserPermissionsService {

  private userPermits: Map<string, boolean> = new Map<string, boolean>();

  constructor(private gridService: GridService) {
    // TODO Temp solution
    this.loadUserPermissions().subscribe();
  }

  public loadUserPermissions(): Observable<IUserPermissionsResponse> {
    return this.gridService.read('/api/userpermits')
      .map((response: IUserPermissionsResponse) => {
        response.userPermits.forEach((userPermission: IUserPermissionModel) => {
          this.userPermits.set(userPermission.name, this.toUserPermissionValue(userPermission));
        });
        return response;
      });
  }

  public hasPermission(permissionName: string | Array<string>): boolean {
    const permissions = Array.isArray(permissionName) ? permissionName : [ permissionName ];
    return permissions.reduce((acc, permission) => {
      return acc || this.userPermits.get(permission);
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
