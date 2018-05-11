export interface ICustomOperationParam {
  id?: number;
  name: string;
  paramTypeCode: number;
  sortOrder: number;
  systemName: string;
  isMandatory: number;
  multiSelect: number;
  dictNameCode: number;
}

export interface ICustomOperationData {
  [paramName: string]: any;
}
