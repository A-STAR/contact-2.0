import { IDebtorCardAction, IDebtorCardState } from './debtor-card.interface';

export const defaultState: IDebtorCardState = {
  debts: null
};

export function reducer(state: IDebtorCardState = defaultState, action: IDebtorCardAction): IDebtorCardState {
  return state;
}
