export interface IOrganization {
  id: number;
  name: string;
  parent: IOrganization;
  children: Array<IOrganization>;
  boxColor: string;
  boxShape: string;
  branchCode: number;
  comment: string;
  curIndex: number;
  expanded: boolean;
}

export interface IOrganizationsResponse {
  success: boolean;
  organizations: Array<any>;
}
