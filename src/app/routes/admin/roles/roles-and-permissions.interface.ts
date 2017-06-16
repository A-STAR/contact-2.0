import { IValueEntity } from '../../../core/converter/value/value-converter.interface';

export interface IPermissionRole {
  id: number;
  name: string;
  comment: string;
}

export interface IPermissionRolesResponse {
  success: boolean;
  roles: Array<IPermissionRole>;
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

export interface IPermissionsResponse {
  permits: IPermissionModel[];
}
