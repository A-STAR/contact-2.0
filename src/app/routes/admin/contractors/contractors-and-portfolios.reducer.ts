import {
  IActionType,
  IContractorsAndPortfoliosState,
  IContractorAndPorfolioAction
} from './contractors-and-portfolios.interface';

export const defaultState: IContractorsAndPortfoliosState = {
  selectedContractor: null,
  selectedManager: null,
  selectedPortfolio: null
};

export function reducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: IContractorAndPorfolioAction
): IContractorsAndPortfoliosState {
  switch (action.type) {
    case IActionType.CONTRACTOR_SELECT:
      return {
        ...state,
        selectedContractor: action.payload.selectedContractor
      };
    case IActionType.MANAGERS_FETCH:
    case IActionType.CONTRACTOR_SAVE:
    case IActionType.PORTFOLIO_SAVE:
    case IActionType.MANAGER_SAVE:
    case IActionType.PORTFOLIO_BACK:
      return {
        ...state
      };
    case IActionType.PORTFOLIO_SELECT:
      return {
        ...state,
        selectedPortfolio: action.payload.selectedPortfolio
      };
    case IActionType.MANAGER_SELECT:
      return {
        ...state,
        selectedManager: action.payload.selectedManager
      };
    default:
      return state;
  }
}
