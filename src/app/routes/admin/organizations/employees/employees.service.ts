import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IEmployeesState } from './employees.interface';

@Injectable()
export class EmployeesService {
  static EMPLOYEES_FETCH = 'EMPLOYEES_FETCH';
  static EMPLOYEES_FETCH_SUCCESS = 'EMPLOYEES_FETCH_SUCCESS';
  static EMPLOYEES_FETCH_ERROR = 'EMPLOYEES_FETCH_ERROR';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IEmployeesState> {
    return this.store
      .select(state => state.employees)
      .filter(Boolean);
  }

  fetch(): void {
    return this.store.dispatch({
      type: EmployeesService.EMPLOYEES_FETCH
    });
  }
}
