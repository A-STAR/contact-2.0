export interface ICustomActionData {
  [paramName: string]: any;
}

export interface ICustomOperation {
  id: number;
  name: string;
}

export interface ICustomOperationResult {
  total: number;
  processed: number;
}

export interface ICustomOperationParams {
  id?: number;
  name: string;
  paramTypeCode: number;
  sortOrder: number;
  systemName: string;
  isMandatory: number;
  multiSelect: number;
  dictNameCode: number;
  entityTypeIds: number;
  lookupKey: number;
}
