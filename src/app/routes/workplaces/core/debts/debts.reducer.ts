import { IDebtsAction, IDebtsState, IDebtsActionType } from './debts.interface';

export const debtsReducer = (state: IDebtsState = [], action: IDebtsAction) => {
  switch (action.type) {
    case IDebtsActionType.FETCH_SUCCESS:
      return action.payload.debts;
    default:
      return state;
  }
};
