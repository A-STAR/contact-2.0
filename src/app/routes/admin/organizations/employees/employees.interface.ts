export interface IEmployee {
  userId: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeesState {
  data: Array<IEmployee>;
  selectedUserId: number;
}

export interface IEmployeeCreateRequest {
  roleCode: number;
  usersIds: Array<number>;
}

export interface IEmployeeUpdateRequest {
  roleCode: number;
  comment: string;
}
