import { Action } from '@ngrx/store';

import { IDebtorsState } from './debtors.interface';
import {
  IDebtorGeneralInformation,
  IDebtorGeneralInformationPhonesPayload
} from './debtor/debtor.interface';

import { DebtorsService } from './debtors.service';
import { DebtorService } from './debtor/debtor.service';

const DEFAULT_STATE: IDebtorsState = {
  debtors: [],
  selectedDebtors: {}
};

export function debtorsReducer(state: IDebtorsState = DEFAULT_STATE, action: Action): IDebtorsState {
  switch (action.type) {
    case DebtorsService.DEBTOR_SELECT:
      return {
        ...state,
        selectedDebtor: action.payload
      };
    case DebtorsService.DEBTORS_FETCH:
      return {
        ...state,
        selectedDebtor: null
      };
    case DebtorsService.DEBTORS_FETCH_SUCCESS:
      return {
        ...state,
        debtors: action.payload
      };
    case DebtorService.DEBTOR_FETCH:
      return {
        ...state,
        currentDebtor: action.payload,
        selectedDebtors: {
          ...state.selectedDebtors,
          [action.payload]: null
        }
      };
    case DebtorService.DEBTOR_FETCH_SUCCESS:
      return {
        ...state,
        selectedDebtors: {
          ...state.selectedDebtors,
          [action.payload.id]: {
            ...state.selectedDebtors[action.payload.id],
            ...action.payload
          }
        }
      };
    case DebtorService.DEBTOR_GENERAL_INFORMATION_FETCH_SUCCESS:
      const debtorGeneralInformationPayload: IDebtorGeneralInformation = action.payload;
      return {
        ...state,
        selectedDebtors: {
          ...state.selectedDebtors,
          [debtorGeneralInformationPayload.id]: {
            ...state.selectedDebtors[debtorGeneralInformationPayload.id],
            generalInformation: {
              ...(state.selectedDebtors[debtorGeneralInformationPayload.id] || { generalInformation: null }).generalInformation,
              ...debtorGeneralInformationPayload
            }
          }
        }
      };
    case DebtorService.DEBTOR_GENERAL_INFORMATION_PHONES_FETCH_SUCCESS:
      const debtorGeneralInformationPhonesPayload: IDebtorGeneralInformationPhonesPayload = action.payload;

      return {
        ...state,
        selectedDebtors: {
          ...state.selectedDebtors,
          [debtorGeneralInformationPhonesPayload.id]: {
            ...state.selectedDebtors[debtorGeneralInformationPhonesPayload.id],
            generalInformation: {
              ...(state.selectedDebtors[debtorGeneralInformationPhonesPayload.id] || { generalInformation: null }).generalInformation,
              phones: debtorGeneralInformationPhonesPayload.data
            }
          }
        }
      };
    default:
      return state;
  }
}
