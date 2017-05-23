import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
// import { IEmployee, IEmployeesResponse } from '../organizations.interface';

@Injectable()
export class EmployeesService {
  constructor(private gridService: GridService) {}

  save(organizationId: number, employee: any): Observable<any> {
    return this.gridService.create('/api/organizations/{id}/users', { id: organizationId }, employee);
  }
}
