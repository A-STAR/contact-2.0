export interface IEmployee {
  userId: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeesState {
  data: Array<IEmployee>;
}
