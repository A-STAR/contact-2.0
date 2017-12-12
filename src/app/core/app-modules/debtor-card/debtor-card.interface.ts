import { IDebt, IPerson } from '../app-modules.interface';

export enum IActionType {
  INIT_BY_DEBT_ID      = 'DEBTOR_CARD_INIT_BY_DEBT_ID',
  INIT_BY_PERSON_ID    = 'DEBTOR_CARD_INIT_BY_PERSON_ID',
  FETCH_PERSON         = 'DEBTOR_CARD_FETCH_PERSON',
  FETCH_PERSON_SUCCESS = 'DEBTOR_CARD_FETCH_PERSON_SUCCESS',
  FETCH_PERSON_FAILURE = 'DEBTOR_CARD_FETCH_PERSON_FAILURE',
  FETCH_DEBTS          = 'DEBTOR_CARD_FETCH_DEBTS',
  FETCH_DEBTS_SUCCESS  = 'DEBTOR_CARD_FETCH_DEBTS_SUCCESS',
  FETCH_DEBTS_FAILURE  = 'DEBTOR_CARD_FETCH_DEBTS_FAILURE',
  REFRESH_DEBTS        = 'DEBTOR_CARD_REFRESH_DEBTS',
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

export interface IFetchPersonFailureAction {
  type: IActionType.FETCH_PERSON_FAILURE;
}

export interface IFetchDebtsSuccessAction {
  type: IActionType.FETCH_DEBTS_SUCCESS;
  payload: {
    debts: IDebt[];
  };
}

export interface IFetchDebtsFailureAction {
  type: IActionType.FETCH_DEBTS_FAILURE;
}

export interface ISelectDebtAction {
  type: IActionType.SELECT_DEBT;
  payload: {
    debtId: number;
  };
}

export type IDebtorCardAction =
  IFetchDebtsAction |
  IFetchDebtsFailureAction |
  IFetchDebtsSuccessAction |
  IFetchPersonAction |
  IFetchPersonFailureAction |
  IFetchPersonSuccessAction |
  IInitByDebtIdAction |
  IInitByPersonIdAction |
  ISelectDebtAction;

export enum IDataStatus {
  LOADING = 'LOADING',
  LOADED  = 'LOADED',
  FAILED  = 'FAILED',
}

export interface IDebtorCardState {
  debts: {
    data: IDebt[];
    status: IDataStatus;
  };
  person: {
    data: IPerson;
    status: IDataStatus;
  };
  selectedDebtId: number;
}

// TODO(d.maltsev): refactor for the sake of a flat structure
export interface IDebtorCardState2 {
  debts: IDebt[];
  debtsStatus: IDataStatus;
  person: IPerson;
  personStatus: IDataStatus;
  selectedDebtId: number;
}
