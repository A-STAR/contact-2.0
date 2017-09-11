export interface IPerson {
  id: number;
  birthDate?: string | Date;
  firstName?: string;
  middleName?: string;
  lastName?: string,
  type?: number;
  responsibleFullName?: string;
  reward?: number;
  debtId?: number;
  product?: string;
  city?: string;
}

export interface IPersonsResponse {
  success: boolean;
  persons: Array<IPerson>;
}


import { IPerson } from './debtor.interface';
import { IDebt } from '../debt-processing.interface';

export interface IDebtState {
  currentDebt?: IDebt;
  currentDebtor?: IPerson;
}

export interface IDebtorsFetchResponse {
  success: boolean;
  debtors: IPerson[];
}
