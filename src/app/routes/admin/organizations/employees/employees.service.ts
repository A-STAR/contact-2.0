import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IEmployeeCreateData, IEmployee } from '../organizations.interface';

@Injectable()
export class EmployeesService {
  constructor(private gridService: GridService) {}

  create(organizationId: number, employee: IEmployeeCreateData): Observable<any> {
    return this.gridService.create('/api/organizations/{organizationId}/users', { organizationId }, employee);
  }

  save(organizationId: number, userId: number, employee: IEmployee): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}/users/{userId}', { organizationId, userId }, employee);
  }

  remove(organizationId: number, userId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}/users/{userId}', { organizationId, userId });
  }
}
