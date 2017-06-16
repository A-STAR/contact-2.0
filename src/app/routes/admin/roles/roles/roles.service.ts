import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IPermissionRole } from '../roles-and-permissions.interface';

@Injectable()
export class RolesService {

  constructor(private gridService: GridService) {
  }

  public getRolesList(): Observable<any> {
    return this.gridService.read('/api/roles')
      .map(
        (data: { roles: Array<IPermissionRole> }) => data.roles.map(role => ({label: role.name, value: role.id}))
      );
  }
}
