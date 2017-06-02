export interface IEmployee {
  userId: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeesState {
  data: Array<IEmployee>;
}

export type IEmployeesActionType = 'EMPLOYEES_FETCH' | 'EMPLOYEES_FETCH_SUCCESS' | 'EMPLOYEES_FETCH_ERROR' | 'EMPLOYEES_CLEAR';

export interface IEmployeesAction {
  type: IEmployeesActionType;
  // TODO: type
  payload?: any;
}
