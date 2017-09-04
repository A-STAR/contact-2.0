import {
  IActionsLogData,
  IActionsLogPayload,
  IActionsLogState,
  IEmployee
} from './actions-log.interface';

import { IUserDictionary } from '../../../core/user/dictionaries/user-dictionaries.interface';

import { ActionsLogService } from './actions-log.service';

const defaultState: IActionsLogState = {
  actionsLog: { data: [], total: 0 },
  employees: [],
  actionTypes: [],
};

export function actionsLogReducer(state: IActionsLogState = defaultState, action: IActionsLogPayload): IActionsLogState {
  switch (action.type) {
    case ActionsLogService.ACTIONS_LOG_DESTROY:
      return { ...defaultState };

    case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
      return {
        ...state,
        actionTypes: action.payload as IUserDictionary
      };

    case ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        employees: action.payload as IEmployee[]
      };

    case ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS:
      return {
        ...state,
        actionsLog: action.payload as IActionsLogData
      };
    default:
      return state;
  }
};
