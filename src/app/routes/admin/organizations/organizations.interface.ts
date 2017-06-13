import { IUser } from '../users/users.interface';

export interface IOrganization {
  id: number;
  name?: string;
  comment?: string;
  branchCode?: number;
  boxColor?: string;
  sortOrder?: number;
  parentId?: number;
  children?: Array<IOrganization>;
}

export interface IEmployee {
  userId: number;
  roleCode: number;
  comment: string;
}

export interface IEmployeesResponse {
  success: boolean;
  users: Array<IEmployee>;
}

export interface IEmployeeCreateRequest {
  roleCode: number;
  usersIds: Array<number>;
}

export interface IEmployeeUpdateRequest {
  roleCode: number;
  comment: string;
}

export enum IOrganizationDialogActionEnum {
  ORGANIZATION_ADD,
  ORGANIZATION_EDIT,
  ORGANIZATION_REMOVE,
  EMPLOYEE_ADD,
  EMPLOYEE_EDIT,
  EMPLOYEE_REMOVE
}

export interface IOrganizationsState {
  organizations: Array<IOrganization>;
  selectedOrganizationId: number;
  employees: Array<IEmployee>;
  notAddedEmployees: Array<IEmployee>;
  selectedEmployeeUserId: number;
  dialogAction: IOrganizationDialogActionEnum;
}

export type IEmployeeUser = IUser & IEmployee;
