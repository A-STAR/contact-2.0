export interface IUserPermissionsResponse {
  success: boolean;
  userPermits: IUserPermissionModel[];
}

export interface IUserPermissionModel {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}
