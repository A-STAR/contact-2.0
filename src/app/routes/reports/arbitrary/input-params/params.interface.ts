export interface IReportInputParam {
  id?: number;
  name: string;
  paramTypeCode: number;
  sortOrder: number;
  systemName: string;
  isMandatory: number;
  multiSelect: number;
  dictNameCode: number;
}

export interface IReportParamValue {
  name: string;
  values: string[];
}
