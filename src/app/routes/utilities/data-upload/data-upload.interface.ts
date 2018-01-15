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
