import { IPerson } from '../debt-processing/debtor/debtor.interface';

export { IPerson };

export interface ISelectedDebtors {
  [index: number]: IPerson;
}

export interface IDebtorsState {
  debtors: IPerson[];
  selectedDebtors: ISelectedDebtors;
  selectedDebtor?: IPerson;
  currentDebtor?: number;
}
