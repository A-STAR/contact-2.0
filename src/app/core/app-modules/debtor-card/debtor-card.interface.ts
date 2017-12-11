import { IDebt, IPerson } from '../app-modules.interface';

export interface INavigationParams {
  debtId: number;
}

export enum IActionType {
  INIT_BY_DEBT_ID      = 'DEBTOR_CARD_INIT_BY_DEBT_ID',
  INIT_BY_PERSON_ID    = 'DEBTOR_CARD_INIT_BY_PERSON_ID',
  FETCH_PERSON         = 'DEBTOR_CARD_FETCH_PERSON',
  FETCH_PERSON_SUCCESS = 'DEBTOR_CARD_FETCH_PERSON_SUCCESS',
  FETCH_DEBTS          = 'DEBTOR_CARD_FETCH_DEBTS',
  FETCH_DEBTS_SUCCESS  = 'DEBTOR_CARD_FETCH_DEBTS_SUCCESS',
  SELECT_DEBT          = 'DEBTOR_CARD_SELECT_DEBT',
}

export interface IInitByDebtIdAction {
  type: IActionType.INIT_BY_DEBT_ID;
  payload: {
    debtId: number;
  };
}

export interface IInitByPersonIdAction {
  type: IActionType.INIT_BY_PERSON_ID;
  payload: {
    personId: number;
  };
}

export interface IFetchPersonAction {
  type: IActionType.FETCH_PERSON;
  payload: {
    personId: number;
  };
}

export interface IFetchDebtsAction {
  type: IActionType.FETCH_DEBTS;
  payload: {
    personId: number;
    selectedDebtId: number;
  };
}

export interface IFetchPersonSuccessAction {
  type: IActionType.FETCH_PERSON_SUCCESS;
  payload: {
    person: IPerson;
  };
}

export interface IFetchDebtsSuccessAction {
  type: IActionType.FETCH_DEBTS_SUCCESS;
  payload: {
    debts: IDebt[];
  };
}

export interface ISelectDebtAction {
  type: IActionType.SELECT_DEBT;
  payload: {
    debtId: number;
  };
}

export type IDebtorCardAction =
  IFetchPersonAction |
  IFetchDebtsAction |
  IFetchDebtsSuccessAction |
  IFetchPersonSuccessAction |
  IInitByDebtIdAction |
  IInitByPersonIdAction |
  ISelectDebtAction;

export interface IDebtorCardState {
  person: IPerson;
  debts: IDebt[];
  selectedDebtId: number;
}
