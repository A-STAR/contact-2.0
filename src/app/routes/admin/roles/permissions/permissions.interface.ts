import { IValueEntity } from '../../../../core/converter/value/value-converter.interface';

export interface IPermissionRole {
  id: number;
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
