import {
  IActionsLogData,
  IActionsLogPayload,
  IActionsLogServiceState,
  IEmployee
} from './actions-log.interface';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';

import { combineWithGrid2Reducer, GRID2_DEFAULT_STATE } from '../../../shared/components/grid2/grid2.reducer';
import { ActionsLogService } from './actions-log.service';

const ACTIONS_LOG_DEFAULT_STATE: IActionsLogServiceState = {
  actionsLog: { data: [], total: 0 },
  employees: [],
  actionTypes: [],
  actionsLogGrid: GRID2_DEFAULT_STATE
};

export function actionsLogReducer(
  state: IActionsLogServiceState = ACTIONS_LOG_DEFAULT_STATE,
  action: IActionsLogPayload
): IActionsLogServiceState {
  return combineWithGrid2Reducer(
    'actionsLogGrid',
    (internalState: IActionsLogServiceState, internalAction: IActionsLogPayload): IActionsLogServiceState => {
      switch (internalAction.type) {
        case ActionsLogService.ACTIONS_LOG_DESTROY:
          return { ...ACTIONS_LOG_DEFAULT_STATE };
        case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
          return {
            ...internalState,
            actionTypes: internalAction.payload as IDictionaryItem[]
          };
        case ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS:
          return {
            ...internalState,
            employees: internalAction.payload as IEmployee[]
          };
        case ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS:
          return {
            ...internalState,
            actionsLog: internalAction.payload as IActionsLogData
          };
      }
      return internalState;
    }
  )(state, action);
}
