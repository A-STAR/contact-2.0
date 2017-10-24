export interface ILdapGroup {
  name: string;
  description: string;
}

export interface ILdapUser {
  login: string;
  name: string;
  isInactive: boolean;
  comment: string;
}
