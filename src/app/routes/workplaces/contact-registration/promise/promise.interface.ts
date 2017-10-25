export interface IPromise {
  amount: number;
  date: string;
  isUnconfirmed: number;
}

export interface IPromiseFormData {
  amount: number;
  percentage: number;
  date: Date;
}
