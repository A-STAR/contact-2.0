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

export type IOrganizationsActionType = 'ORGANIZATIONS_FETCH' | 'ORGANIZATIONS_FETCH_SUCCESS' | 'ORGANIZATIONS_FETCH_ERROR' | 'ORGANIZATIONS_CLEAR';

export interface IOrganizationsAction {
  type: IOrganizationsActionType;
  // TODO: type
  payload?: any;
}
