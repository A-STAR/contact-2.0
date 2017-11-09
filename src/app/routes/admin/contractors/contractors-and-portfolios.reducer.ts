import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

export const defaultState: IContractorsAndPortfoliosState = {
  contractors: null,
  selectedContractorId: null,
  portfolios: null,
  selectedPortfolioId: null,
  managers: null,
  selectedManagerId: null
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function reducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: UnsafeAction
): IContractorsAndPortfoliosState {
  switch (action.type) {

    // Contractors:
    // case ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS:
    //   const { contractors } = action.payload;
    //   const selectedContractorId = contractors.find(c => c.id === state.selectedContractorId)
    //     ? state.selectedContractorId : null;

    //   return {
    //     ...state,
    //     selectedContractorId,
    //     portfolios: null,
    //     selectedPortfolioId: null
    //   };
    case ContractorsAndPortfoliosService.CONTRACTORS_CLEAR:
      return {
        ...state,
        selectedContractorId: null
      };
    case ContractorsAndPortfoliosService.CONTRACTOR_SELECT:
    return {
      ...state,
      selectedContractorId: action.payload.contractorId
    };
    // Contractors:
    case ContractorsAndPortfoliosService.MANAGERS_CLEAR_SELECTED_FOR_CONTRACTOR:
    delete state.mapContracorToSelectedManager[action.payload.contractorId];
    return state;
    case ContractorsAndPortfoliosService.MANAGER_SELECT:
      Object.assign({}, state.mapContracorToSelectedManager, action.payload.mapContractorToManagerId);
      return {
        ...state,
        mapContracorToSelectedManager: Object.assign({},
                                                     state.mapContracorToSelectedManager,
                                                     action.payload.mapContracorToSelectedManager
                                                    )
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
}
