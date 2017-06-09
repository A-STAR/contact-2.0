import { IActionLog, IActionsLogPayload, IActionsLogServiceState, IActionType, IEmployee } from './actions-log.interface';

import { combineWithGrid2Reducer } from '../../../shared/components/grid2/grid2.reducer';
import { ActionsLogService } from './actions-log.service';

const defaultState: IActionsLogServiceState = {
  actionsLog: [],
  employees: [],
  actionTypes: []
};

export function actionsLogReducer(
  state: IActionsLogServiceState = defaultState,
  action: IActionsLogPayload
) {
  return combineWithGrid2Reducer(
    'actionsLogGrid',
    function (state: IActionsLogServiceState, action: IActionsLogPayload): IActionsLogServiceState {
      switch (action.type) {
        case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
          return {
            ...state,
            actionTypes: action.payload as Array<IActionType>
          };
        case ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS:
          return {
            ...state,
            employees: action.payload as Array<IEmployee>
          };
        case ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS:
          return {
            ...state,
            actionsLog: action.payload as Array<IActionLog>
          };
      }
      return state;
    }
  )(state, action);
}
