export interface IOrganization {
  id: number;
  name: string;
  comment: string;
  branchCode: number;
  boxColor: string;
  sortOrder: number;
  children?: Array<IOrganization>;
}

export interface IOrganizationsResponse {
  success: boolean;
  organizations: Array<IOrganization>;
}

export interface IEmployee {
  userId: number;
  roleCode: number;
  isBlocked: number;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  mobPhone: string;
  workPhone: string;
  intPhone: string;
  comment: string;
}

export interface IEmployeesResponse {
  success: boolean;
  users: Array<IEmployee>;
}
