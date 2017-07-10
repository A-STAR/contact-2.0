import { Action } from '@ngrx/store';

import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

const defaultState: IContractorsAndPortfoliosState = {
  contractors: null,
  selectedContractorId: null,
  portfolios: null,
  selectedPortfolioId: null
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function contractorsAndPortfoliosReducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: Action
): IContractorsAndPortfoliosState {
  switch (action.type) {
    case ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS:
      return {
        ...state,
        contractors: action.payload.contractors,
        // TODO(d.maltsev): preserve selected contractor row
        selectedContractorId: null,
        portfolios: null,
        selectedPortfolioId: null
      };
    case ContractorsAndPortfoliosService.CONTRACTORS_CLEAR:
      return {
        ...state,
        contractors: null,
        selectedContractorId: null
      };
    case ContractorsAndPortfoliosService.CONTRACTOR_SELECT:
      return {
        ...state,
        selectedContractorId: action.payload.contractorId
      };
    case ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS:
      return {
        ...state,
        portfolios: action.payload.portfolios,
        // TODO(d.maltsev): preserve selected contractor row
        selectedPortfolioId: null
      };
    case ContractorsAndPortfoliosService.PORTFOLIOS_CLEAR:
      return {
        ...state,
        portfolios: null,
        selectedPortfolioId: null
      };
    case ContractorsAndPortfoliosService.PORTFOLIO_SELECT:
      return {
        ...state,
        selectedPortfolioId: action.payload.portfolioId
      };
    default:
      return state;
  }
};
