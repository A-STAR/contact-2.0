import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IEmployeeCreateRequest, IEmployeeUpdateRequest, IEmployeesState } from './employees.interface';

@Injectable()
export class EmployeesService {
  static EMPLOYEES_FETCH         = 'EMPLOYEES_FETCH';
  static EMPLOYEES_FETCH_SUCCESS = 'EMPLOYEES_FETCH_SUCCESS';
  static EMPLOYEES_FETCH_ERROR   = 'EMPLOYEES_FETCH_ERROR';
  static EMPLOYEES_CREATE        = 'EMPLOYEES_CREATE';
  static EMPLOYEES_CREATE_ERROR  = 'EMPLOYEES_CREATE_ERROR';
  static EMPLOYEES_UPDATE        = 'EMPLOYEES_UPDATE';
  static EMPLOYEES_UPDATE_ERROR  = 'EMPLOYEES_UPDATE_ERROR';
  static EMPLOYEES_DELETE        = 'EMPLOYEES_DELETE';
  static EMPLOYEES_DELETE_ERROR  = 'EMPLOYEES_DELETE_ERROR';
  static EMPLOYEES_CLEAR         = 'EMPLOYEES_CLEAR';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IEmployeesState> {
    return this.store
      .select(state => state.employees)
      .filter(Boolean);
  }

  fetch(organizationId: number): void {
    return this.store.dispatch({
      type: EmployeesService.EMPLOYEES_FETCH,
      payload: {
        organizationId
      }
    });
  }

  create(organizationId: number, employee: IEmployeeCreateRequest): void {
    return this.store.dispatch({
      type: EmployeesService.EMPLOYEES_CREATE,
      payload: {
        organizationId,
        employee
      }
    });
  }

  update(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): void {
    return this.store.dispatch({
      type: EmployeesService.EMPLOYEES_UPDATE,
      payload: {
        organizationId,
        userId,
        employee
      }
    });
  }

  delete(organizationId: number, userId: number): void {
    return this.store.dispatch({
      type: EmployeesService.EMPLOYEES_DELETE,
      payload: {
        organizationId,
        userId
      }
    });
  }
}
