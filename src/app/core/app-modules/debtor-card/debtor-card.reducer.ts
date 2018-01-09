import { IActionType, IDataStatus, IDebtorCardAction, IDebtorCardState } from './debtor-card.interface';

export const defaultState: IDebtorCardState = {
  debts: {
    data: null,
    status: null,
  },
  person: {
    data: null,
    status: null,
  },
  selectedDebtId: null,
  entityId: null,
  entityTypeId: null
};

export function reducer(state: IDebtorCardState = defaultState, action: IDebtorCardAction): IDebtorCardState {
  switch (action.type) {
    case IActionType.FETCH_PERSON:
      return {
        ...state,
        person: {
          ...state.person,
          status: IDataStatus.LOADING,
        }
      };
    case IActionType.FETCH_PERSON_SUCCESS:
      return {
        ...state,
        person: {
          data: action.payload.person,
          status: IDataStatus.LOADED,
        },
      };
    case IActionType.FETCH_PERSON_FAILURE:
      return {
        ...state,
        person: {
          ...state.person,
          status: IDataStatus.FAILED,
        },
      };
    case IActionType.FETCH_DEBTS:
      return {
        ...state,
        debts: {
          ...state.debts,
          status: IDataStatus.LOADING,
        }
      };
    case IActionType.FETCH_DEBTS_SUCCESS:
      return {
        ...state,
        debts: {
          data: action.payload.debts,
          status: IDataStatus.LOADED,
        },
      };
    case IActionType.FETCH_DEBTS_FAILURE:
      return {
        ...state,
        debts: {
          ...state.debts,
          status: IDataStatus.FAILED,
        },
      };
    case IActionType.SELECT_DEBT:
      return {
        ...state,
        selectedDebtId: action.payload.debtId,
        entityId: action.payload.debtId,
        entityTypeId: action.payload.entityTypeId
      };
    case IActionType.SELECT_ENTITY:
      return {
        ...state,
        entityId: action.payload.entityId,
        entityTypeId: action.payload.entityTypeId
      };
    default:
      return state;
  }
}
