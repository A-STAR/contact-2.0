import { Action } from '@ngrx/store';

import { IDebtProcessingState } from './debt-processing.interface';

import { combineWithAGridReducer, AGRID_DEFAULT_STATE } from '../../../shared/components/grid2/grid2.reducer';
import { DebtProcessingService } from './debt-processing.service';

const defaultState: IDebtProcessingState = {
  debts: [],
  grid: AGRID_DEFAULT_STATE
};

const ownReducer = (ownState: IDebtProcessingState, ownAction: Action): IDebtProcessingState => {
  switch (ownAction.type) {
    case DebtProcessingService.DEBT_PROCESSING_FETCH_SUCCESS:
      return {
        ...ownState,
        debts: ownAction.payload.debts
      };
    default:
      return ownState;
  }
};

export function debtProcessingReducer(state: IDebtProcessingState = defaultState, action: Action): IDebtProcessingState {
  return combineWithAGridReducer('grid', ownReducer)(state, action);
}
