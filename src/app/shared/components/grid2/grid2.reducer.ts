import {
  IActionGrid2Payload,
  IGrid2ColumnFilterPayload,
  IGrid2ColumnMovingPayload,
  IGrid2ColumnSettings,
  IGrid2ColumnsPositionsPayload,
  IGrid2GroupingColumnsPayload,
  IGrid2SelectedPayload,
  IGrid2SortDirectionPayload,
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
      case Grid2Component.APPLY_FILTER:
      case Grid2Component.COLUMNS_POSITIONS:
      case Grid2Component.DESTROY_STATE:
      case Grid2Component.GROUPING_COLUMNS:
      case Grid2Component.MOVING_COLUMN:
      case Grid2Component.NEXT_PAGE:
      case Grid2Component.PAGE_SIZE:
      case Grid2Component.PREVIOUS_PAGE:
      case Grid2Component.SELECTED_ROWS:
      case Grid2Component.SORTING_DIRECTION:
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

    case Grid2Component.SELECTED_ROWS:
      const selectedRowPayload = action.payload as IGrid2SelectedPayload;
      return {
        ...state,
        selectedRows: state.selectedRows
          .filter((rowData: any) => selectedRowPayload.rowData !== rowData)
          .concat(selectedRowPayload.selected ? [selectedRowPayload.rowData] : [])
      };

    case Grid2Component.GROUPING_COLUMNS:
      const groupingColumnsPayload = action.payload as IGrid2GroupingColumnsPayload;
      return {
        ...state,
        selectedRows: [],
        groupingColumns: groupingColumnsPayload.groupingColumns
      };

    case Grid2Component.COLUMNS_POSITIONS:
      const columnsPositionsPayload = action.payload as IGrid2ColumnsPositionsPayload;
      return {
        ...state,
        selectedRows: [],
        columnsPositions: columnsPositionsPayload.columnsPositions,
        columnsSettings: R.mapObjIndexed((columnSettings: IGrid2ColumnSettings, columnId: string) => {
          return {
            ...columnSettings,
            sortOrder: columnsPositionsPayload.columnsPositions.findIndex((_columnId: string) => columnId === _columnId)
          };
        }, state.columnsSettings)
      };

    case Grid2Component.SORTING_DIRECTION:
      const sorters = action.payload as IGrid2SortDirectionPayload;
      return {
        ...state,
        selectedRows: [],
        columnsSettings: {
          ...sorters,
        }
      };

    case Grid2Component.APPLY_FILTER:
      const columnFilterPayload = action.payload as IGrid2ColumnFilterPayload;
      return {
        ...state,
        selectedRows: [],
        columnsSettings: {
          ...state.columnsSettings,
          [columnFilterPayload.columnId]: {
            ...(state.columnsSettings[columnFilterPayload.columnId]),
            filter: columnFilterPayload.filter
          }
        }
      };
    default:
      return state;
  }
}
