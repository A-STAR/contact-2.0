import { Action } from '@ngrx/store';

import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

const defaultState: IContractorsAndPortfoliosState = {
  contractors: null,
  selectedContractorId: null,
  portfolios: null,
  selectedPortfolioId: null,
  managers: null,
  selectedManagerId: null
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function contractorsAndPortfoliosReducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: Action
): IContractorsAndPortfoliosState {
  switch (action.type) {

    // Contractors:
    case ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS:
      const { contractors } = action.payload;
      const selectedContractorId = contractors.find(c => c.id === state.selectedContractorId)
        ? state.selectedContractorId : null;

      return {
        ...state,
        contractors: [...contractors],
        selectedContractorId,
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

    // Contractors:
    case ContractorsAndPortfoliosService.MANAGERS_FETCH_SUCCESS:
      return {
        ...state,
        managers: [...action.payload.managers],
        // TODO(d.maltsev): preserve selected contractor row
        selectedManagerId: null
      };
    case ContractorsAndPortfoliosService.MANAGERS_CLEAR:
      return {
        ...state,
        managers: null,
        selectedManagerId: null
      };
    case ContractorsAndPortfoliosService.MANAGER_SELECT:
      return {
        ...state,
        selectedManagerId: action.payload.managerId
      };

    // Portfolios:
    case ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS:
      const { portfolios } = action.payload;
      const selectedPortfolioId = portfolios.find(p => p.id === state.selectedPortfolioId)
        ? state.selectedPortfolioId : null;

      return {
        ...state,
        portfolios: [...portfolios],
        selectedPortfolioId
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
