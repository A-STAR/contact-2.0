import {
  IActionsLogPayload,
  IActionsLogState,
  IEmployee
} from './actions-log.interface';

import { IUserTerm } from '../../../core/user/dictionaries/user-dictionaries.interface';

import { ActionsLogService } from './actions-log.service';

export const defaultState: IActionsLogState = {
  employees: [],
  actionTypes: [],
};

export function reducer(state: IActionsLogState = defaultState, action: IActionsLogPayload): IActionsLogState {
  switch (action.type) {
    case ActionsLogService.ACTIONS_LOG_DESTROY:
      return { ...defaultState };

    case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
      return {
        ...state,
        actionTypes: action.payload as IUserTerm[]
      };

    case ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        employees: action.payload as IEmployee[]
      };

    default:
      return state;
  }
}
