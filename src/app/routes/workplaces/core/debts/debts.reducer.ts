import { IDebtsAction, IDebtsCollection, IDebtsActionType } from './debts.interface';

export function debtsReducer(state: IDebtsCollection = [], action: IDebtsAction): IDebtsCollection {
  switch (action.type) {
    case IDebtsActionType.FETCH_SUCCESS:
      return action.payload.debts;
    default:
      return state;
  }
}
