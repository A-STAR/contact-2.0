import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IPermissionModel, IPermissionRole } from './permissions.interface';

@Injectable()
export class PermissionsService {

  constructor(
    private gridService: GridService,
    private valueConverterService: ValueConverterService
  ) { }

  editPermission(role: IPermissionRole, permissionId: number, permission: IPermissionModel): Observable<any> {
    return this.gridService.update(
      `/roles/{id}/permits/{permissionId}`,
      { id: role.id, permissionId: permissionId }, this.valueConverterService.serialize(permission)
    );
  }

  removePermission(role: IPermissionRole, permissionId: number): Observable<any> {
    // console.log(role, permissionId);
    return this.gridService.delete(
      `/roles/{id}/permits/{permissionId}`, { id: role.id, permissionId: permissionId }
    );
  }

  // addPermission(role: IPermissionRole, permissionsIds: number []): Observable<any> {
  //   return this.gridService.create(
  //     `/roles/{id}/permits`, role, { permitIds: permissionsIds }
  //   );
  // }
}
