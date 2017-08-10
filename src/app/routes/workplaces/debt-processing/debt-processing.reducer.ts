import { Action } from '@ngrx/store';

import { IDebtProcessingState } from './debt-processing.interface';

import { DebtProcessingService } from './debt-processing.service';

const defaultState: IDebtProcessingState = {
  debts: [],
};

export function debtProcessingReducer(state: IDebtProcessingState = defaultState, action: Action): IDebtProcessingState {
  switch (action.type) {
    case DebtProcessingService.DEBT_PROCESSING_FETCH_SUCCESS:
      return {
        ...state,
        debts: action.payload.debts
      };
    default:
      return state;
  }
};
