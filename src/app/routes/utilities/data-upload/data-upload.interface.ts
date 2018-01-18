export interface ICell {
  columnId: string;
  errorMsg: string;
  statusCode: number;
  value: number | string;
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
  value: string;
}

export interface IErrorsResponse {
  fileName: string;
  fileBody: File;
}

export enum DataUploaders {
  CONTACT_HISTORY = 'CONTACT_HISTORY',
  CURRENCY_RATE = 'CURRENCY_RATE',
  DEBTS = 'DEBTS',
  PAYMENT = 'PAYMENT',
  SET_OPERATOR = 'SET_OPERATOR',
}

export type TDataUploaders = 'CONTACT_HISTORY' & 'CURRENCY_RATE' & 'DEBTS' & 'PAYMENT' & 'SET_OPERATOR';

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

/**
 *  still no support for enum keys
 * @see https://github.com/Microsoft/TypeScript/issues/2491
*/
export type IUploadersConfig = {
  [key in TDataUploaders]: IDataUploaderConfig;
};

