import { Injectable } from '@angular/core';

import { GridService } from '../../../../shared/components/grid/grid.service';
import {
  IPermissionModel, IPermissionRole, IPermissionsRequest
} from './permissions.interface';

@Injectable()
export class PermissionsService {

  constructor(private gridService: GridService) {
  }

  public editPermission(role: IPermissionRole, permissionId: number, permission: IPermissionModel): Promise<any> {
    return this.gridService.update(
      `/api/roles/{id}/permits/{permissionId}`,
      { id: role.id, permissionId: permissionId },
      this.buildRequest(permission)
    );
  }

  public removePermission(role: IPermissionRole, request: IPermissionsRequest): Promise<any> {
    return this.gridService.delete(`/api/roles/{id}/permits`, role, request);
  }

  public addPermission(role: IPermissionRole, permissionsIds: number []): Promise<any> {
    return this.gridService.create(
      `/api/roles/{id}/permits`,
      role,
      { permitIds: permissionsIds }
    );
  }

  // TODO Eliminate duplication
  private buildRequest = (data: IPermissionModel): IPermissionModel => {
    switch (data.typeCode) {
      case 1:
        data.valueN = parseInt(data.value as string, 10);
        break;
      case 3:
        data.valueS = data.value as string;
        break;
      case 4:
        data.valueB = data.value ? 1 : 0;
        break;
    }
    delete data.value;
    return data;
  }
}
