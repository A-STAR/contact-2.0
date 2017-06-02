export interface IOrganization {
  id: number;
  name: string;
  comment: string;
  branchCode: number;
  boxColor: string;
  sortOrder: number;
  children?: Array<IOrganization>;
}

export interface IOrganizationsState {
  data: Array<IOrganization>;
}

export type IOrganizationsActionType = 'ORGANIZATIONS_LOAD';

export interface IOrganizationsAction {
  type: IOrganizationsActionType;
  // TODO: type
  payload?: any;
}
