import { IPermissionModel, IPermissionRole } from '../../routes/admin/roles/permissions/permissions.interface';
import { IValueEntity } from '../converter/value/value-converter.interface';

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

export enum IPermissionsDisplayEnum {
  NONE,
  ADD,
  EDIT,
  DELETE,
}

export interface IPermission {
  [key: string]: boolean;
}

export interface IPermissionsState {
  permissions: IPermission;
  display: IPermissionsDisplayEnum;
  editedPermission: IPermissionModel;
  currentRole: IPermissionRole;
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

