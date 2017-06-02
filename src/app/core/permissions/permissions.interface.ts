export interface IPermissionsResponse {
  success: boolean;
  userPermits: IPermission[];
}

export interface IPermission {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IPermissionsState {
  permissions: Array<IPermission>;
}

export type IPermissionActionType = 'PERMISSION_FETCH' | 'PERMISSION_INVALIDATE' | 'PERMISSION_UPDATE' | 'PERMISSION_DELETE';

export interface IPermissionAction {
  type: IPermissionActionType;
  payload?: any;
}
