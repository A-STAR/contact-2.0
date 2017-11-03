import { IDebtState } from './debtor.interface';
import { UnsafeAction } from '../../../../core/state/state.interface';

const defaultState: IDebtState = {
  currentDebt: null,
  currentDebtor: null,
};

function reducer(state: IDebtState = defaultState, action: UnsafeAction): IDebtState {
  switch (action.type) {
    case 'CHANGE_CURRENT_DEBT':
      return {
        ...state,
        currentDebt: { ...action.payload }
      };
    case 'CHANGE_CURRENT_DEBTOR':
      return {
        ...state,
        currentDebtor: { ...action.payload }
      };
    default:
      return state;
  }
}

const debtReducer = {
  defaultState,
  reducer,
};

export default debtReducer;
