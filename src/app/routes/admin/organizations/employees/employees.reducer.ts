import { Action } from '@ngrx/store';

import { IEmployeesState } from './employees.interface';

import { EmployeesService } from './employees.service';

const defaultState: IEmployeesState = {
  data: []
};

export function employeesReducer(state: IEmployeesState = defaultState, action: Action): IEmployeesState {
  switch (action.type) {
    case EmployeesService.EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload.organizations
      };
    default:
      return state;
  }
};
