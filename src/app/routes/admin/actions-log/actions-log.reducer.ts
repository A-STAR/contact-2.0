import { IActionsLogAction, IActionsLogServiceState } from './actions-log.interface';

import { ActionsLogService } from './actions-log.service';

const defaultState: IActionsLogServiceState = {
  actionsLog: []
};

export function actionsLogReducer(
  state: IActionsLogServiceState = defaultState,
  action: IActionsLogAction
) {
  switch (action.type) {
    case ActionsLogService.ACTIONS_LOG_FETCH:
      if (action.success) {
        return {
          ...state,
          actionsLog: action.success
        };
      }
  }
  return state;
}
