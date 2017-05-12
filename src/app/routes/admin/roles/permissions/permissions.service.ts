import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridService } from '../../../../shared/components/grid/grid.service';
import {
  IPermissionModel, IPermissionRole, IPermissionsRequest
} from './permissions.interface';

@Injectable()
export class PermissionsService {

  constructor(private gridService: GridService,
              private valueConverterService: ValueConverterService) {
  }

  public editPermission(role: IPermissionRole, permissionId: number, permission: IPermissionModel): Observable<any> {
    return this.gridService.update(
      `/api/roles/{id}/permits/{permissionId}`,
      { id: role.id, permissionId: permissionId },
      this.valueConverterService.serialize(permission)
    );
  }

  public removePermission(role: IPermissionRole, permissionId: number): Observable<any> {
    return this.gridService.delete(`/api/roles/{id}/permits/${permissionId}`, role);
  }

  public addPermission(role: IPermissionRole, permissionsIds: number []): Observable<any> {
    return this.gridService.create(
      `/api/roles/{id}/permits`,
      role,
      { permitIds: permissionsIds }
    );
  }
}
