import { IDebtsAction, IDebtsCollection, IDebtsActionType } from './debts.interface';

export const debtsReducer = (state: IDebtsCollection = [], action: IDebtsAction) => {
  switch (action.type) {
    case IDebtsActionType.FETCH_SUCCESS:
      return action.payload.debts;
    default:
      return state;
  }
};
