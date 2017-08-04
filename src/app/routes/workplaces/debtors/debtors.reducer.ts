import { Action } from '@ngrx/store';

import { IDebtorsState } from './debtors.interface';

import { DebtorsService } from './debtors.service';
import { DebtorService } from '../debt-processing/debtor/debtor.service';

const DEFAULT_STATE: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

export function debtorsReducer(state: IDebtorsState = DEFAULT_STATE, action: Action): IDebtorsState {
  return state;
}
