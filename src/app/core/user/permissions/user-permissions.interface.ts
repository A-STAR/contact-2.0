export interface IUserPermission {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IUserPermissions {
  [key: string]: IUserPermission;
}

export interface IUserPermissionsState {
  permissions: IUserPermissions;
}
