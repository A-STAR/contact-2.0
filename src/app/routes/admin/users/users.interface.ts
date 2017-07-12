export interface IUser {
  id: number;
  login: string;
  roleId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  comment: string;
  email: string;
  password: string;
  ldapLogin: string;
  workPhone: string;
  mobPhone: string;
  intPhone: string;
  workAddress: string;
  position: string;
  startWorkDate: string | Date;
  endWorkDate: string | Date;
  languageId: number;
  isBlocked: boolean;
}

export interface IUsersResponse {
  success: boolean;
  users: Array<IUser>;
}

export interface IUserEditPermissions {
  canEditUser: boolean;
  canEditRole: boolean;
  canEditLdap: boolean;
}

export interface ILdapGroup {
  name: string;
  description: string;
}

export interface IUsersState {
  users: Array<IUser>;
  selectedUserId: number;
  displayBlocked: boolean;
  ldapGroups: Array<ILdapGroup>;
}
