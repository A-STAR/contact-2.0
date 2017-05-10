import { Injectable } from '@angular/core';

import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { IPermissionRole, IPermissionsRequest } from './permissions.interface';

@Injectable()
export class PermissionsService {

  constructor(private gridService: GridService,
              private userPermissionsService: UserPermissionsService) {
  }

  public editPermission(role: IPermissionRole, permitId: number, request: IPermissionsRequest): Promise<any> {
    return this.gridService.update(`/api/roles/{id}/permits/${permitId}`, role, request);
  }

  public removePermission(role: IPermissionRole, request: IPermissionsRequest): Promise<any> {
    return this.gridService.delete(`/api/roles/{id}/permits`, role, request);
  }

  public addPermission(role: IPermissionRole, request: IPermissionsRequest): Promise<any> {
    return this.gridService.create(`/api/roles/{id}/permits`, role, request);
  }

  public canAddPermission(): boolean {
    return this.userPermissionsService.hasPermission('PERMIT_ADD');
  }

  public canDeletePermission(): boolean {
    return this.userPermissionsService.hasPermission('PERMIT_DELETE');
  }

  public canEditPermission(): boolean {
    return this.userPermissionsService.hasPermission('PERMIT_EDIT');
  }

  public canShowPermission(): boolean {
    return this.userPermissionsService.hasPermission('PERMIT_VIEW');
  }
}
