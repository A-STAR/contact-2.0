import { IActionsLogPayload, IActionsLogServiceState } from './actions-log.interface';

import { ActionsLogService } from './actions-log.service';

const defaultState: IActionsLogServiceState = {
  actionsLog: []
};

export function actionsLogReducer(
  state: IActionsLogServiceState = defaultState,
  action: IActionsLogPayload
): IActionsLogServiceState {
  switch (action.type) {
    case ActionsLogService.ACTIONS_LOG_SUCCESS_FETCH:
      return {
        ...state,
        actionsLog: action.payload
      };
  }
  return state;
}
