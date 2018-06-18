export type IQueryParam = string | number | boolean;

export interface IQueryParams {
  [key: string]: IQueryParam | IQueryParam[];
}

export interface IResponse<T> {
  success: boolean;
  data: T;
}

export interface IMassInfoResponse {
  success: boolean;
  massInfo: {
    processed: number;
    total: number;
  };
}

export interface BlobResponse {
  blob: Blob;
  fileName?: string;
}
