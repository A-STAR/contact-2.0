import { Action } from '@ngrx/store';

import { IDebtState } from './debtor.interface';

const DEFAULT_STATE: IDebtState = {
  currentDebt: null,
  currentDebtor: null,
};

export function debtReducer(state: IDebtState = DEFAULT_STATE, action: Action): IDebtState {
  switch (action.type) {
    case 'CHANGE_CURRENT_DEBT':
      return {
        ...state,
        currentDebt: { ...action.payload }
      };
    case 'CHANGE_CURRENT_DEBTOR':
      return {
        ...state,
        currentDebtor: { ...action.payload }
      };
    default:
      return state;
  }
}
