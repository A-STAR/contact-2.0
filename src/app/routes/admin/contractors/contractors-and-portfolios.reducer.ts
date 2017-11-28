import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

export const defaultState: IContractorsAndPortfoliosState = {
  selectedContractorId: null,
  selectedPortfolioId: null,
};

export function reducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: SafeAction<IContractorsAndPortfoliosState>
): IContractorsAndPortfoliosState {
  switch (action.type) {
    case ContractorsAndPortfoliosService.CONTRACTOR_SELECT:
    return {
      ...state,
      ...action.payload
    };
    case ContractorsAndPortfoliosService.PORTFOLIO_SELECT:
    return {
      ...state,
      ...action.payload
    };
    case ContractorsAndPortfoliosService.MANAGER_SELECT:
    default:
      return state;
  }
}
