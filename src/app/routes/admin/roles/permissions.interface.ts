export interface IPermissionRole {
  id: number;
}

export interface IDataValue {
  valueS?: string;
  valueB?: number;
  valueN?: number;
}

export interface IDisplayProperties {
  removePermit: boolean;
  addPermit: boolean;
  editPermit: boolean;
}
