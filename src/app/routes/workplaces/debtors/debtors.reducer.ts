import { IDebtorsState } from './debtors.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

const defaultState: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

function reducer(state: IDebtorsState = defaultState, action: UnsafeAction): IDebtorsState {
  return state;
}

const debtorsReducer = {
  defaultState,
  reducer,
};

export default debtorsReducer;
