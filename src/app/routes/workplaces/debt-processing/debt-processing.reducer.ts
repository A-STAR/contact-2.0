import { Action } from '@ngrx/store';

import { IDebtProcessingState } from './debt-processing.interface';

import { combineWithAGridReducer, AGRID_DEFAULT_STATE } from '../../../shared/components/grid2/grid2.reducer';
import { DebtProcessingService } from './debt-processing.service';

const defaultState: IDebtProcessingState = {
  debts: [],
  // grid: AGRID_DEFAULT_STATE
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

// export function debtProcessingReducer(state: IDebtProcessingState = defaultState, action: Action): IDebtProcessingState {
//   return combineWithAGridReducer('grid', ownReducer)(state, action);
// }
