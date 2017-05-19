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
  comment: string;
}
