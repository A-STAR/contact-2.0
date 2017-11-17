export interface IQueryParams {
  [key: string]: string;
}

export interface IResponse<T> {
  success: boolean;
  data: T;
}
