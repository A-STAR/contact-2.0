import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IEmployeeCreateRequest, IEmployeeUpdateRequest } from './employees.interface';

import { EmployeesService } from './employees.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class EmployeesEffects {

  @Effect()
  fetch$ = this.actions
    .ofType(EmployeesService.EMPLOYEES_FETCH)
    .switchMap(action => {
      const { organizationId } = action.payload;
      return this.read(organizationId)
        .map(data => ({
          type: EmployeesService.EMPLOYEES_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => Observable.of({
          type: EmployeesService.EMPLOYEES_FETCH_ERROR
        }));
    });

  @Effect()
  create$ = this.actions
    .ofType(EmployeesService.EMPLOYEES_CREATE)
    .switchMap(action => {
      const { organizationId, employee } = action.payload;
      return this.create(organizationId, employee)
        .map(data => ({
          type: EmployeesService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        // TODO: action creator
        .catch(() => Observable.of({
          type: 'NOTIFICATION_PUSH',
          payload: {
            notification: {
              message: 'Could not fetch users',
              type: 'ERROR'
            }
          }
        }));
    });

  @Effect()
  update$ = this.actions
    .ofType(EmployeesService.EMPLOYEES_UPDATE)
    .switchMap(action => {
      const { organizationId, userId, employee } = action.payload;
      return this.update(organizationId, userId, employee)
        .map(data => ({
          type: EmployeesService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => Observable.of({
          type: EmployeesService.EMPLOYEES_UPDATE_ERROR
        }));
    });

  @Effect()
  delete$ = this.actions
    .ofType(EmployeesService.EMPLOYEES_DELETE)
    .switchMap(action => {
      const { organizationId, userId } = action.payload;
      return this.delete(organizationId, userId)
        .map(data => ({
          type: EmployeesService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => Observable.of({
          type: EmployeesService.EMPLOYEES_DELETE_ERROR
        }));
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
  ) {}

  private read(organizationId: number): Observable<any> {
    return this.gridService.read('/api/organizations/{organizationId}/users', { organizationId });
  }

  private create(organizationId: number, employee: IEmployeeCreateRequest): Observable<any> {
    return this.gridService.create('/api/organizations/{organizationId}/users', { organizationId }, employee);
  }

  private update(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}/users/{userId}', { organizationId, userId }, employee);
  }

  private delete(organizationId: number, userId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}/users/?id={userId}', { organizationId, userId });
  }
}
