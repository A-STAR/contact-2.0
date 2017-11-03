import { IDebtorsState } from './debtors.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

export const defaultState: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

export function reducer(state: IDebtorsState = defaultState, action: UnsafeAction): IDebtorsState {
  return state;
}
