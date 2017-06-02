export interface IEmployee {
  userId: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeesState {
  data: Array<IEmployee>;
}

export type IEmployeesActionType = 'EMPLOYEES_FETCH' | 'EMPLOYEES_FETCH_SUCCESS';

export interface IEmployeesAction {
  type: IEmployeesActionType;
  // TODO: type
  payload?: any;
}
