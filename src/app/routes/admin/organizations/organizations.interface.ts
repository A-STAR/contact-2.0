import { IUser } from '../users/users.interface';
import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

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
  isMain: boolean;
}

export interface IEmployeeCreateRequest {
  roleCode: number;
  usersIds: Array<number>;
}

export interface IEmployeeUpdateRequest {
  roleCode: number;
  comment: string;
  isMain: number;
}

export enum IOrganizationDialogActionEnum {
  ORGANIZATION_ADD,
  ORGANIZATION_EDIT,
  ORGANIZATION_REMOVE,
  EMPLOYEE_ADD,
  EMPLOYEE_EDIT,
  EMPLOYEE_REMOVE
}

export interface IOrganizationSelectPayload {
  selectedOrganization: ITreeNode;
  organizations?: ITreeNode[];
}

export interface IEmployeeSelectPayload {
  employees?: Array<IEmployee>;
  notAddedEmployees?: Array<IEmployee>;
  selectedEmployeeUserId: number;
}

export interface IOrganizationsState extends IOrganizationSelectPayload, IEmployeeSelectPayload {
  dialogAction: IOrganizationDialogActionEnum;
}

export type IEmployeeUser = IUser & IEmployee;
