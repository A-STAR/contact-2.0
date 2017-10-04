export interface IUser {
  id: number;
  comment: string;
  email: string;
  endWorkDate: string | Date;
  intPhone: string;
  isAutoReset: boolean;
  isInactive: boolean;
  firstName: string;
  middleName: string;
  languageId: number;
  lastName: string;
  ldapLogin: string;
  login: string;
  mobPhone: string;
  password: string;
  position: string;
  roleId: number;
  startWorkDate: string | Date;
  workAddress: string;
  workPhone: string;
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

export interface IUsersState {
  users: Array<IUser>;
  selectedUserId: number;
  displayInactive: boolean;
}
