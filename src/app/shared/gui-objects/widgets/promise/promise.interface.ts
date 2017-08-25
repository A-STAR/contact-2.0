export interface IEmployment {
  id?: number;
  workTypeCode: number;
  company?: string;
  position?: string;
  hireDate?: Date | string;
  dismissDate?: Date | string;
  income?: number;
  currencyId?: number;
  comment?: string;
}

export interface IPromise {
  id?: number;
  promiseDate: Date | string;
  promiseSum: number;
  receiveDateTime: Date | string;
  statusCode?: number;
  comment?: string;
  fullName?: string;
}
