import { Action } from '@ngrx/store';

import { IDebtorsState } from './debtors.interface';

const DEFAULT_STATE: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

export function debtorsReducer(state: IDebtorsState = DEFAULT_STATE, action: Action): IDebtorsState {
  return state;
}
