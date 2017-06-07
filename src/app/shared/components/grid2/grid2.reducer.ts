import {
  IActionGrid2Payload,
  IGrid2ColumnsPositionsChangePayload,
  IGrid2MovedColumnPayload,
  IGrid2ShowFilterPayload,
  IGrid2SortingDirectionSwitchPayload,
  IGrid2State
} from './grid2.interface';

import { Grid2Component } from './grid2.component';

const defaultState: IGrid2State = {
  columns: {},
  columnsPositions: []
};

export function grid2Reducer(
  state: IGrid2State = defaultState,
  action: IActionGrid2Payload
): IGrid2State {
  switch (action.type) {
    case Grid2Component.MOVING_COLUMN:
      return {
        ...state,
        movingColumnInProgress: (action.payload as IGrid2MovedColumnPayload).movingColumnInProgress
      };
    case Grid2Component.OPEN_FILTER:
      return {
        ...state,
        filterColumnName: (action.payload as IGrid2ShowFilterPayload).filterColumnName
      };
    case Grid2Component.CLOSE_FILTER:
      return {
        ...state,
        filterColumnName: null
      };
    case Grid2Component.COLUMNS_POSITIONS:
      const columnsPositionsPayload: IGrid2ColumnsPositionsChangePayload = action.payload as IGrid2ColumnsPositionsChangePayload;
      return {
        ...state,
        columnsPositions: columnsPositionsPayload.columnsPositions
      };
    case Grid2Component.SORTING_DIRECTION:
      const sortingDirectionPayload: IGrid2SortingDirectionSwitchPayload = action.payload as IGrid2SortingDirectionSwitchPayload;
      if (sortingDirectionPayload.multiSort) {
        return {
          ...state,
          columns: {
            ...state.columns,
            [sortingDirectionPayload.columnId]: {
              ...(state.columns[sortingDirectionPayload.columnId]),
              sortingDirection: sortingDirectionPayload.sortingDirection
            }
          }
        };
      } else {
        return {
          ...state,
          columns: {
            // TODO Copy columns options except sortingDirection
            [sortingDirectionPayload.columnId]: {
              ...(state.columns[sortingDirectionPayload.columnId]),
              sortingDirection: sortingDirectionPayload.sortingDirection
            }
          }
        };
      }
  }
  return state;
}
