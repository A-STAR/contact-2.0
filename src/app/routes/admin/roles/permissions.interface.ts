import { IValueEntity } from '../../../core/converter/value-converter.interface';

export { IValueEntity };

export interface IPermissionRole {
  id: number;
  name: string;
  comment: string;
}

export interface IPermissionsRequest {
  permitIds: number[];
}

export interface IPermissionModel extends IValueEntity {
  id: number;
  altDsc: string;
  dsc: string;
  name: string;
  comment?: string;
}

export interface IRawPermission {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IPermissionsState {
  currentPermission: IPermissionModel;
  currentRole: IPermissionRole;
  permissions: IPermissionModel[];
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

