export type IQueryParam = string | number | boolean;

export interface IQueryParams {
  [key: string]: IQueryParam;
}

export interface IResponse<T> {
  success: boolean;
  data: T;
}
