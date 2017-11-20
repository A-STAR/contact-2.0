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
  id?: number;
  userId: number;
  roleCode: number;
  comment: string;
  isMain: boolean;
}

export interface IEmployeeCreateRequest {
  roleCode: number;
  usersIds: number[];
}

export interface IEmployeeUpdateRequest {
  roleCode: number;
  comment: string;
  isMain: number;
}

export interface IOrganizationSelectState {
  selectedOrganization: ITreeNode;
  organizations?: ITreeNode[];
}

export interface IEmployeeSelectState {
  employees?: IEmployee[];
  selectedEmployeeUserId: number;
}

export type IOrganizationsState = IOrganizationSelectState & IEmployeeSelectState;

export type IEmployeeUser = IUser & IEmployee;
