import { IDebt } from '../app-modules.interface';

export enum IDebtorCardActionType {
  FETCH         = 'DEBTOR_CARD_FETCH',
  FETCH_SUCCESS = 'DEBTOR_CARD_FETCH_SUCCESS',
}

export interface IDebtorCardAction {
  // TODO(d.maltsev): type-safe actions
  type: string;
}

export interface IDebtorCardState {
  debts: IDebt[];
}
