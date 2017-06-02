import { IEmployeesAction, IEmployeesState } from './employees.interface';

const defaultState: IEmployeesState = {
  data: []
};

export function employeesReducer(state: IEmployeesState = defaultState, action: IEmployeesAction): IEmployeesState {
  switch (action.type) {
    case 'EMPLOYEES_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload.organizations
      };
    default:
      return state;
  }
};
