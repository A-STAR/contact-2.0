import { IActionLog, IActionsLogPayload, IActionsLogServiceState, IActionType, IEmployee } from './actions-log.interface';

import { IActionGrid2Payload } from '../../../shared/components/grid2/grid2.interface';

import { grid2Reducer } from '../../../shared/components/grid2/grid2.reducer';
import { ActionsLogService } from './actions-log.service';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

const defaultState: IActionsLogServiceState = {
  actionsLog: [],
  employees: [],
  actionTypes: []
};

export function actionsLogReducer(
  state: IActionsLogServiceState = defaultState,
  action: IActionsLogPayload|IActionGrid2Payload
): IActionsLogServiceState {
  switch (action.type) {
    case Grid2Component.COLUMNS_POSITIONS:
    case Grid2Component.SORTING_DIRECTION:
    case Grid2Component.OPEN_FILTER:
    case Grid2Component.CLOSE_FILTER:
    case Grid2Component.MOVING_COLUMN:
    case Grid2Component.DESTROY_STATE:
      return {
        ...state,
        actionsLogGrid: grid2Reducer(state.actionsLogGrid, action as IActionGrid2Payload)
      };
    case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
      return {
        ...state,
        actionTypes: action.payload as Array<IActionType>
      };
    case ActionsLogService.EMPLOYEES_FETCH_SUCCESS:
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
