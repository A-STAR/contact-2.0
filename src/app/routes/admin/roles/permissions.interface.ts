import { IPermissionModel, IPermissionRole } from './roles-and-permissions.interface';
import { IValueEntity } from '../../../core/converter/value/value-converter.interface';

export { IPermissionModel, IPermissionRole, IValueEntity };

export interface IPermissionsResponse {
  success: boolean;
  userPermits: IRawPermission[];
}

export interface IRawPermission {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export enum IPermissionsDialogEnum {
  NONE,
  PERMISSION_ADD,
  PERMISSION_EDIT,
  PERMISSION_DELETE,
  ROLE_ADD,
  ROLE_EDIT,
  ROLE_DELETE,
  ROLE_COPY
}

export interface IPermission {
  [key: string]: boolean;
}

export interface IPermissionsState {
  permissions: IPermission;
  dialog: IPermissionsDialogEnum;
  currentPermission: IPermissionModel;
  currentRole: IPermissionRole;
  rawPermissions: IPermissionModel[];
  roles: Array<IPermissionRole>;
}

export type IPermissionActionType =
  'PERMISSION_FETCH' |
  'PERMISSION_FETCH_SUCCESS' |
  'PERMISSION_ADD' |
  'PERMISSION_UPDATE' |
  'PERMISSION_DELETE';

export interface IPermissionAction {
  type: IPermissionActionType;
  payload?: any;
}

