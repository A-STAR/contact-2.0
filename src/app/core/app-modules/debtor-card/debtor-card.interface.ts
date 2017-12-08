import { IDebt, IPerson } from '../app-modules.interface';

export enum IActionType {
  INIT_BY_DEBT_ID             = 'DEBTOR_CARD_INIT_BY_DEBT_ID',
  INIT_BY_PERSON_ID           = 'DEBTOR_CARD_INIT_BY_PERSON_ID',
  FETCH_PERSON                = 'DEBTOR_CARD_FETCH_PERSON',
  FETCH_PERSON_SUCCESS        = 'DEBTOR_CARD_FETCH_PERSON_SUCCESS',
  FETCH_PERSON_DEBTS          = 'DEBTOR_CARD_FETCH_DEBTS',
  FETCH_PERSON_DEBTS_SUCCESS  = 'DEBTOR_CARD_FETCH_DEBTS_SUCCESS',
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

export interface IFetchPersonDebtsAction {
  type: IActionType.FETCH_PERSON_DEBTS;
  payload: {
    personId: number;
  };
}

export interface IFetchPersonSuccessAction {
  type: IActionType.FETCH_PERSON_SUCCESS;
  payload: {
    person: IPerson;
  };
}

export interface IFetchPersonDebtsSuccessAction {
  type: IActionType.FETCH_PERSON_DEBTS_SUCCESS;
  payload: {
    debts: IDebt[];
  };
}

export type IDebtorCardAction =
  IFetchPersonAction |
  IFetchPersonDebtsAction |
  IFetchPersonDebtsSuccessAction |
  IFetchPersonSuccessAction |
  IInitByDebtIdAction |
  IInitByPersonIdAction;

export interface IDebtorCardState {
  person: IPerson;
  debts: IDebt[];
  selectedDebtId: number;
}
