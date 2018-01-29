export type ICellValue = string | number | Date | boolean | null;

export interface ICell {
  columnId: string;
  errorMsg: string;
  statusCode: number;
  value: ICellValue;
}

export interface IRow {
  cells: ICell[];
  id: number;
}

export interface IColumn {
  id: string;
  label: string;
  typeCode: number;
  dictCode?: number;
}

export interface IOpenFileResponse {
  guid: number;
  rows: IRow[];
  columns: IColumn[];
}

export interface IDataResponse {
  rows: IRow[];
}

export interface ICellPayload {
  rowId: number;
  columnId: string;
  value: ICellValue;
}

export interface IErrorsResponse {
  fileName: string;
  fileBody: File;
}

export enum DataUploaders {
  NONE,
  // 1 and 2
  PAYMENT_NEW,
  PAYMENT_UPDATE,
  SET_OPERATOR,
  DEBTS,
  CONTACT_HISTORY,
  // not fetched from the server
  CURRENCY_RATE,
}

export interface IDataUploaderConfig {
  openFile: string;
  fetch: string;
  editCell: string;
  deleteRow: string;
  cancel: string;
  save: string;
  getErrors: string;
  // optional key for additional parameter
  paramKey?: string;
}

