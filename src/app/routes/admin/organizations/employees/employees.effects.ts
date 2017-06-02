import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IEmployeeCreateData, IEmployee } from '../organizations.interface';

import { EmployeesService } from './employees.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class EmployeesEffects {

  @Effect()
  fetchEmployees = this.actions
    .ofType(EmployeesService.ACTION_FETCH)
    .switchMap(action => {
      return this.read()
        .map(data => ({
          type: EmployeesService.ACTION_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => Observable.of({
          type: EmployeesService.ACTION_FETCH_ERROR
        }));
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
  ) {}

  read(): Observable<any> {
    return this.gridService.read('/api/organizations');
  }

  create(organizationId: number, employee: IEmployeeCreateData): Observable<any> {
    return this.gridService.create('/api/organizations/{organizationId}/users', { organizationId }, employee);
  }

  update(organizationId: number, userId: number, employee: IEmployee): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}/users/{userId}', { organizationId, userId }, employee);
  }

  delete(organizationId: number, userId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}/users/?id={userId}', { organizationId, userId });
  }
}
