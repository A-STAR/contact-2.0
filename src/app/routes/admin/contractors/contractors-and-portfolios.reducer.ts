import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

export const defaultState: IContractorsAndPortfoliosState = {
  selectedContractorId: null,
};

export function reducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: UnsafeAction
): IContractorsAndPortfoliosState {
  switch (action.type) {
    case ContractorsAndPortfoliosService.CONTRACTOR_SELECT:
    return {
      ...state,
      selectedContractorId: action.payload.contractorId
    };
    case ContractorsAndPortfoliosService.MANAGER_SELECT:
      return {
        ...state,
        mapContractorToSelectedManager: Object
          .assign( {}, state.mapContractorToSelectedManager, action.payload.mapContractorToSelectedManager)
      };
    case ContractorsAndPortfoliosService.PORTFOLIO_SELECT:
      return {
        ...state,
        mapContractorToSelectedPortfolio: Object
          .assign( {}, state.mapContractorToSelectedPortfolio, action.payload.mapContractorToSelectedPortfolio)
      };
    default:
      return state;
  }
}
