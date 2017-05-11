import { Injectable } from '@angular/core';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IPermissionRole, IPermissionsRequest } from './permissions.interface';

@Injectable()
export class PermissionsService {

  constructor(private gridService: GridService) {
  }

  public editPermission(role: IPermissionRole, permitId: number, request: IPermissionsRequest): Promise<any> {
    return this.gridService.update(`/api/roles/{id}/permits/${permitId}`, role, request);
  }

  public removePermission(role: IPermissionRole): Promise<any> {
    return this.gridService.delete(`/api/roles/{id}/permits`, role);
  }

  public addPermission(role: IPermissionRole, request: IPermissionsRequest): Promise<any> {
    return this.gridService.create(`/api/roles/{id}/permits`, role, request);
  }
}
