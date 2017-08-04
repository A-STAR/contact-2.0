import { IPerson } from '../debt-processing/debtor/debtor.interface';

export interface ISelectedDebtors {
  [index: number]: IPerson;
}

export interface IDebtorsState {
  debtors: IPerson[];
  selectedDebtors: ISelectedDebtors;
  selectedDebtor?: IPerson;
  currentDebtor?: number;
}

export interface IDebtorsFetchResponse {
  success: boolean;
  debtors: IPerson[];
}
