export interface ICell {
  id: number;
  value: string;
  statusCode: number;
  errorMsg: string;
}

export interface IRow {
  id: number;
  cells: ICell[];
}

export interface IColumn {
  name: string;
  order: number;
  typeCode: number;
  dictCode: number;
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
  cellId: number;
  value: string;
}

export interface IErrorsResponse {
  fileName: string;
  fileBody: File;
}
