export interface IPromise {
  id?: number;
  comment?: string;
  fullName?: string;
  isUnconfirmed?: number;
  promiseDate: Date | string;
  promiseSum: number;
  receiveDateTime: Date | string;
  statusCode?: number;
}

export interface IPromiseLimit {
  hasActivePromise: boolean;
  maxDays: number;
  minAmountPercent: number;
}
