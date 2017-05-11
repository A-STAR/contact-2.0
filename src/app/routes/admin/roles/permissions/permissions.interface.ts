export interface IPermissionRole {
  id: number;
}

export interface IPermissionsRequest {
  permitIds: number[];
}

export interface IPermissionEditRequest extends IPermissionRole {
  permitId: number;
  permission: IPermissionModel;
}

export interface IValueEntity {
  typeCode?: number;
  valueB?: number | boolean;
  valueS?: string;
  valueN?: number;
  value?: string | number | boolean;
}

export interface IPermissionModel extends IValueEntity {
  id: number;
  altDsc: string;
  dsc: string;
  name: string;
  comment?: string;
}
