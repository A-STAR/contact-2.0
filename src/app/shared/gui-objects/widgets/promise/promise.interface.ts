export interface IPromise {
  id?: number;
  promiseDate: Date | string;
  promiseSum: number;
  receiveDateTime: Date | string;
  statusCode?: number;
  comment?: string;
  fullName?: string;
}
