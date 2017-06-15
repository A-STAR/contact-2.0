import {
  IActionGrid2Payload,
  IGrid2ColumnsPositionsChangePayload,
  IGrid2GroupingColumnsChangePayload,
  IGrid2MovedColumnPayload,
  IGrid2SelectedRowChangePayload,
  IGrid2ShowFilterPayload,
  IGrid2SortingDirectionSwitchPayload,
  IGrid2State
} from './grid2.interface';

import { Grid2Component } from './grid2.component';

const defaultState: IGrid2State = {
  columns: {},
  columnsPositions: [],
  groupingColumns: [],
  selectedRows: []
};

export function combineWithGrid2Reducer(stateKey: string, outerReducer: Function): Function {
  return function (
    state,
    action
  ) {
    switch (action.type) {
      case Grid2Component.COLUMNS_POSITIONS:
      case Grid2Component.SORTING_DIRECTION:
      case Grid2Component.OPEN_FILTER:
      case Grid2Component.CLOSE_FILTER:
      case Grid2Component.MOVING_COLUMN:
      case Grid2Component.DESTROY_STATE:
      case Grid2Component.GROUPING_COLUMNS:
      case Grid2Component.SELECTED_ROWS:
        return {
          ...state,
          [stateKey]: grid2Reducer(state[stateKey], action as IActionGrid2Payload)
        };
      default:
        return outerReducer(state, action);
    }
  }
}

export function grid2Reducer(
  state: IGrid2State = defaultState,
  action: IActionGrid2Payload
): IGrid2State {
  switch (action.type) {
    case Grid2Component.DESTROY_STATE:
      return { ...defaultState };
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
    case Grid2Component.SELECTED_ROWS:
      const selectedRowPayload: IGrid2SelectedRowChangePayload = action.payload as IGrid2SelectedRowChangePayload;
      return {
        ...state,
        selectedRows: state.selectedRows
          .filter((rowData: any) => selectedRowPayload.rowData !== rowData)
          .concat(selectedRowPayload.selected ? [selectedRowPayload.rowData] : [])
      };
    case Grid2Component.GROUPING_COLUMNS:
      const groupingColumnsPayload: IGrid2GroupingColumnsChangePayload = action.payload as IGrid2GroupingColumnsChangePayload;
      return {
        ...state,
        groupingColumns: groupingColumnsPayload.groupingColumns
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
    default:
      return state;
  }
}
