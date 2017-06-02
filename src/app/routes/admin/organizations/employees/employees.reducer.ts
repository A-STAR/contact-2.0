import { Action } from '@ngrx/store';

import { IEmployeesState } from './employees.interface';

import { EmployeesService } from './employees.service';

const defaultState: IEmployeesState = {
  data: [],
  selectedRecord: null
};

export function employeesReducer(state: IEmployeesState = defaultState, action: Action): IEmployeesState {
  switch (action.type) {
    case EmployeesService.EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload.users
      };
    case EmployeesService.EMPLOYEES_CLEAR:
      return {
        ...state,
        data: []
      };
    default:
      return state;
  }
};
