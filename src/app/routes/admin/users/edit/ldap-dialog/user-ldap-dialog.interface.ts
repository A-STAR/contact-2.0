export interface ILdapGroup {
  name: string;
  description: string;
}

export interface ILdapGroupsResponse {
  success: boolean;
  groups: Array<ILdapGroup>;
}

export interface ILdapUser {
  name: string;
}

export interface ILdapUsersResponse {
  success: boolean;
  users: Array<ILdapUser>;
}
