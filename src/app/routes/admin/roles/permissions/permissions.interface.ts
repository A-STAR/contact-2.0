export interface IPermissionRole {
  id: number;
}

export interface IPermissionsRequest {
  permitIds: number[];
}

export interface IPermissionModel {
  id: number;
  altDsc: string;
  dsc: string;
  name: string;
  value: string | number | boolean;
  comment?: string;
  typeCode?: number;
  valueB?: boolean;
  valueS?: string;
}
