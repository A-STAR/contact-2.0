import {
  IActionsLogData,
  IActionsLogPayload,
  IActionsLogServiceState,
  IEmployee
} from './actions-log.interface';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';

import { combineWithAGridReducer, AGRID_DEFAULT_STATE } from '../../../shared/components/grid2/grid2.reducer';
import { ActionsLogService } from './actions-log.service';

const defaultState: IActionsLogServiceState = {
  actionsLog: { data: [], total: 0 },
  employees: [],
  actionTypes: [],
  actionsLogGrid: AGRID_DEFAULT_STATE,
};

const ownReducer = (ownState: IActionsLogServiceState, ownAction: IActionsLogPayload): IActionsLogServiceState => {
  switch (ownAction.type) {
    case ActionsLogService.ACTIONS_LOG_DESTROY:
      return { ...defaultState };

    case ActionsLogService.ACTION_TYPES_FETCH_SUCCESS:
      return {
        ...ownState,
        actionTypes: ownAction.payload as IDictionaryItem[]
      };

    case ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS:
      return {
        ...ownState,
        employees: ownAction.payload as IEmployee[]
      };

    case ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS:
      return {
        ...ownState,
        actionsLog: ownAction.payload as IActionsLogData
      };
    default:
      return ownState;
  }
};

export function actionsLogReducer(state: IActionsLogServiceState = defaultState, action: IActionsLogPayload): IActionsLogServiceState {
  return combineWithAGridReducer('actionsLogGrid', ownReducer)(state, action);
}
