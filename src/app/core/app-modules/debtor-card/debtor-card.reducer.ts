import { IDebtorCardAction, IActionType, IDebtorCardState } from './debtor-card.interface';

export const defaultState: IDebtorCardState = {
  debts: null,
  person: null,
  selectedDebtId: null,
};

export function reducer(state: IDebtorCardState = defaultState, action: IDebtorCardAction): IDebtorCardState {
  switch (action.type) {
    case IActionType.FETCH_PERSON_SUCCESS:
      return {
        ...state,
        person: action.payload.person,
      };
    case IActionType.FETCH_PERSON_DEBTS_SUCCESS:
      return {
        ...state,
        debts: action.payload.debts,
      };
    case IActionType.SELECT_PERSON_DEBT:
      return {
        ...state,
        selectedDebtId: action.payload.debtId,
      };
    default:
      return state;
  }
}
