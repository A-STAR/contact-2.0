export interface IDebt {
  id: number;
  debtAmount: number;
}

export interface IDebtsCollection {
  [key: number]: IDebt;
}

export interface IDebtsState {
  debts: IDebtsCollection;
}

export enum IDebtsActionType {
  FETCH            = 'WORKPLACES_DEBTS_FETCH',
  FETCH_FOR_PERSON = 'WORKPLACES_DEBTS_FETCH_FOR_PERSON',
  FETCH_SUCCESS    = 'WORKPLACES_DEBTS_FETCH_SUCCESS',
  FETCH_FAILURE    = 'WORKPLACES_DEBTS_FETCH_FAILURE',
}

export interface IDebtsFetchAction {
  type: IDebtsActionType.FETCH;
  payload: {
    debtId: number;
  };
}

export interface IDebtsFetchForPersonAction {
  type: IDebtsActionType.FETCH_FOR_PERSON;
  payload: {
    personId: number;
  };
}

export interface IDebtsFetchSuccessAction {
  type: IDebtsActionType.FETCH_SUCCESS;
  payload: {
    debts: IDebt[];
  };
}

export interface IDebtsFetchFailureAction {
  type: IDebtsActionType.FETCH_FAILURE;
}

export type IDebtsAction = IDebtsFetchAction | IDebtsFetchForPersonAction | IDebtsFetchSuccessAction | IDebtsFetchFailureAction;
