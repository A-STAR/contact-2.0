import { Action } from '@ngrx/store';

import { IDebtProcessingState } from './debt-processing.interface';

import { DebtProcessingService } from './debt-processing.service';

const defaultState: IDebtProcessingState = {
  data: [],
  total: 0,
};

export function debtProcessingReducer(state: IDebtProcessingState = defaultState, action: Action): IDebtProcessingState {
  switch (action.type) {
    case DebtProcessingService.DEBT_PROCESSING_FETCH_SUCCESS:
    case DebtProcessingService.DEBT_PROCESSING_CLEAR:
      return {
        ...action.payload
      };
    default:
      return state;
  }
};
