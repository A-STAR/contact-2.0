import { Action } from '@ngrx/store';

import { IDebtorsState } from './debtors.interface';

import { DebtorService } from './debtor/debtor.service';

const DEFAULT_STATE: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

export function debtorsReducer(state: IDebtorsState = DEFAULT_STATE, action: Action): IDebtorsState {
  switch (action.type) {
    case DebtorService.DEBTOR_FETCH:
      return {
        ...state,
        selectedDebtors: {
          ...state.selectedDebtors,
          [action.payload.id]: null
        }
      };
    case DebtorService.DEBTOR_FETCH_SUCCESS:
      return {
        ...state,
        selectedDebtors: {
          ...state.selectedDebtors,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
}
