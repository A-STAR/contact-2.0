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
  paramTypeCode: OperationControlTypeEnum;
  sortOrder: number;
  systemName: string;
  isMandatory: number;
  multiSelect: number;
  dictNameCode: number;
  entityTypeIds: number;
  lookupKey: number;
}

export enum CustomOperation {
  DEBT_DISTRIBUTION       = 5,
  PBX_CAMPAIGN_STATISTICS = 7,
}

export enum OperationControlTypeEnum {
  DATE = 1,
  NUMBER = 2,
  PORTFOLIOS = 3,
  OPERATORS = 4,
  CONTRACTORS = 5,
  TEXT = 6,
  DICTIONARY = 7,
  OUTGOING_PORTFOLIOS = 8,
  CHECKBOX = 9,
  DATETIME = 10,
  GROUP = 11,
  LOOKUP = 12
}
