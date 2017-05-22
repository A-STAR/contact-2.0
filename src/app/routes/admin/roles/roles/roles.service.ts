import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IRole } from './roles.interface';

@Injectable()
export class RolesService {

  constructor(private gridService: GridService) {
  }

  public getRolesList(): Observable<any> {
    return this.gridService.read('/api/roles')
      .map(
        (data: { roles: Array<IRole> }) => data.roles.map(role => ({label: role.name, value: role.id}))
      );
  }

  public copyRole(params: any): Observable<any> {
    return this.gridService.create('/api/roles/{id}/copy', {id: params.originalRoleId}, params);
  }
}
