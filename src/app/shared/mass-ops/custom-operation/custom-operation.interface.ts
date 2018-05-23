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
