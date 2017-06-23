import { IDebtor } from '../debtors.interface';

export interface IDebtorCardFetchResponse {
  success: boolean;
  debtor: IDebtor;
}
