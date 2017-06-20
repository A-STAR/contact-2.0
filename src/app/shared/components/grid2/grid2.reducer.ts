import {
  IActionGrid2Payload,
  IGrid2ColumnMovingPayload,
  IGrid2ColumnSettings,
  IGrid2ColumnsPositionsChangePayload,
  IGrid2GroupingColumnsChangePayload,
  IGrid2SelectedRowChangePayload,
  IGrid2ShowFilterPayload,
  IGrid2SortingDirectionSwitchPayload,
  IGrid2State
} from './grid2.interface';
import * as R from 'ramda';

import { Grid2Component } from './grid2.component';

export const GRID2_DEFAULT_STATE: IGrid2State = {
  currentPage: 1,
  pageSize: Grid2Component.DEFAULT_PAGE_SIZE,
  columnsSettings: {},
  columnsPositions: [],
  groupingColumns: [],
  selectedRows: [],
  columnMovingInProgress: false
};

export function combineWithGrid2Reducer(stateKey: string, outerReducer: Function): Function {
  return function (state: any, action: { type: any }): any {
    switch (action.type) {
      case Grid2Component.COLUMNS_POSITIONS:
      case Grid2Component.SORTING_DIRECTION:
      case Grid2Component.OPEN_FILTER:
      case Grid2Component.CLOSE_FILTER:
      case Grid2Component.MOVING_COLUMN:
      case Grid2Component.DESTROY_STATE:
      case Grid2Component.GROUPING_COLUMNS:
      case Grid2Component.SELECTED_ROWS:
      case Grid2Component.PAGE_SIZE:
      case Grid2Component.NEXT_PAGE:
      case Grid2Component.PREVIOUS_PAGE:
        return {
          ...state,
          [stateKey]: grid2Reducer(state[stateKey], action as IActionGrid2Payload)
        };
      default:
        return outerReducer(state, action);
    }
  };
}

export function grid2Reducer(
  state: IGrid2State = GRID2_DEFAULT_STATE,
  action: IActionGrid2Payload
): IGrid2State {
  switch (action.type) {
    case Grid2Component.DESTROY_STATE:
      return { ...GRID2_DEFAULT_STATE };
    case Grid2Component.MOVING_COLUMN:
      return {
        ...state,
        columnMovingInProgress: (action.payload as IGrid2ColumnMovingPayload).movingColumnInProgress
      };
    case Grid2Component.PAGE_SIZE:
      return {
        ...state,
        selectedRows: [],
        currentPage: GRID2_DEFAULT_STATE.currentPage,
        pageSize: (action.payload as number)
      };
    case Grid2Component.PREVIOUS_PAGE:
      return {
        ...state,
        selectedRows: [],
        currentPage: (action.payload as number) - 1
      };
    case Grid2Component.NEXT_PAGE:
      return {
        ...state,
        selectedRows: [],
        currentPage: (action.payload as number) + 1
      };
    case Grid2Component.OPEN_FILTER:
      return {
        ...state,
        currentFilterColumn: (action.payload as IGrid2ShowFilterPayload).currentFilterColumn
      };
    case Grid2Component.CLOSE_FILTER:
      return {
        ...state,
        currentFilterColumn: null
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
        selectedRows: [],
        groupingColumns: groupingColumnsPayload.groupingColumns
      };
    case Grid2Component.COLUMNS_POSITIONS:
      const columnsPositionsPayload: IGrid2ColumnsPositionsChangePayload = action.payload as IGrid2ColumnsPositionsChangePayload;

      return {
        ...state,
        selectedRows: [],
        columnsPositions: columnsPositionsPayload.columnsPositions,
        columnsSettings: R.mapObjIndexed((columnSettings: IGrid2ColumnSettings, columnId: string) => {
          return {
            ...columnSettings,
            sortingOrder: columnsPositionsPayload.columnsPositions.findIndex((_columnId: string) => columnId === _columnId)
          };
        }, state.columnsSettings)
      };
    case Grid2Component.SORTING_DIRECTION:
      const sortingDirectionPayload: IGrid2SortingDirectionSwitchPayload = action.payload as IGrid2SortingDirectionSwitchPayload;
      if (sortingDirectionPayload.multiSort) {
        return {
          ...state,
          selectedRows: [],
          columnsSettings: {
            ...state.columnsSettings,
            [sortingDirectionPayload.columnId]: {
              ...(state.columnsSettings[sortingDirectionPayload.columnId]),
              sortingDirection: sortingDirectionPayload.sortingDirection,
              sortingOrder: sortingDirectionPayload.sortingOrder
            }
          }
        };
      } else {
        return {
          ...state,
          selectedRows: [],
          columnsSettings: {
            [sortingDirectionPayload.columnId]: {
              ...(state.columnsSettings[sortingDirectionPayload.columnId]),
              sortingDirection: sortingDirectionPayload.sortingDirection,
              sortingOrder: sortingDirectionPayload.sortingOrder
            }
          }
        };
      }
    default:
      return state;
  }
}