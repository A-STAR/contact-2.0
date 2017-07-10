import { Action } from '@ngrx/Store';

import { IContractorsAndPortfoliosState } from './contractors-and-portfolios.interface';

const defaultState: IContractorsAndPortfoliosState = {
  contractors: null,
  portfolios: null
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function contractorsAndPortfoliosReducer(
  state: IContractorsAndPortfoliosState = defaultState,
  action: Action
): IContractorsAndPortfoliosState {
  // TODO(d.maltsev)
  return state;
};
