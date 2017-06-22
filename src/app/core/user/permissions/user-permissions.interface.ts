export interface IUserPermission {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IUserPermissionsResponse {
  success: boolean;
  userPermits: Array<IUserPermission>;
}

export interface IUserPermissionsState {
  languages: Array<IUserPermission>;
  isResolved: boolean;
}
