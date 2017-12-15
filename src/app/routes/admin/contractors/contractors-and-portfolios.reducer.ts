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
    case IActionType.CONTRACTOR_EDIT:
      return {
        ...state,
        selectedContractor: action.payload.selectedContractor
      };
    case IActionType.PORTFOLIO_CREATE:
      return {
        ...state,
        selectedContractor: action.payload.selectedContractor
      };
    case IActionType.MANAGERS_FETCH:
    case IActionType.CONTRACTOR_CREATE:
    case IActionType.CONTRACTOR_SAVE:
    case IActionType.PORTFOLIO_SAVE:
    case IActionType.MANAGER_SAVE:
      return {
        ...state
      };
    case IActionType.PORTFOLIO_SELECT:
      return {
        ...state,
        selectedPortfolio: action.payload.selectedPortfolio
      };
    case IActionType.PORTFOLIO_EDIT:
      return {
        ...state,
        selectedContractor: action.payload.selectedContractor,
        selectedPortfolio: action.payload.selectedPortfolio
      };
    case IActionType.MANAGER_SELECT:
    case IActionType.MANAGER_EDIT:
      return {
        ...state,
        selectedManager: action.payload.selectedManager
      };
    default:
      return state;
  }
}
