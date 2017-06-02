import { IUser } from '../users/users.interface';

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
  userId?: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeeCreateData {
  roleCode: number;
  usersIds: Array<number>;
}

export interface IEmployeesResponse {
  success: boolean;
  users: Array<IEmployee>;
}

export type IEmployeeUser = IUser & IEmployee;



export interface IOrganizationsState {
  organizations: Array<IOrganization>;
  employees: Array<IEmployee>;
}

export type IOrganizationsActionType = 'ORGANIZATIONS_LOAD';

export interface IOrganizationsAction {
  type: IOrganizationsActionType;
  // TODO: type
  payload?: any;
}
