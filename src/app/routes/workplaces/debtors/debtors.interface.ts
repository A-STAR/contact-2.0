import { IDebtor } from './debtor/debtor.interface';

export interface ISelectedDebtors {
  [index: number]: IDebtor;
}

export interface IDebtorsState {
  debtors: IDebtor[];
  selectedDebtors: ISelectedDebtors;
  selectedDebtor?: IDebtor;
  currentDebtor?: number;
}

export interface IDebtorsFetchResponse {
  success: boolean;
  debtors: IDebtor[];
}
