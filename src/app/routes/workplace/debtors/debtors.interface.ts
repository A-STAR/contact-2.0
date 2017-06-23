export interface IDebtor {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface ISelectedDebtors {
  [index: number]: IDebtor;
}

export interface IDebtorsState {
  debtors: IDebtor[];
  selectedDebtors: ISelectedDebtors;
}
