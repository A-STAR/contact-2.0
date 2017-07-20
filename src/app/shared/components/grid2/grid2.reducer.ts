import {
  IGrid2EventPayload,
  IGrid2Groups,
  IGrid2Selected,
  IAGridSortModel,
  IGrid2State
} from './grid2.interface';

import { Grid2Component } from './grid2.component';

export const GRID2_DEFAULT_STATE: IGrid2State = {
  currentPage: 1,
  pageSize: Grid2Component.DEFAULT_PAGE_SIZE,
  sorters: [],
  groups: [],
  selectedRows: [],
};

export function combineWithGrid2Reducer(stateKey: string, outerReducer: Function): Function {
  return function (state: any, action: { type: any }): any {
    switch (action.type) {
      case Grid2Component.DESTROY_STATE:
      case Grid2Component.GROUPING_COLUMNS:
      case Grid2Component.MOVING_COLUMN:
      case Grid2Component.NEXT_PAGE:
      case Grid2Component.PAGE_SIZE:
      case Grid2Component.PREVIOUS_PAGE:
      case Grid2Component.FIRST_PAGE:
      case Grid2Component.LAST_PAGE:
      case Grid2Component.SELECTED_ROWS:
      case Grid2Component.SORTING_DIRECTION:
        return {
          ...state,
          [stateKey]: grid2Reducer(state[stateKey], action as IGrid2EventPayload)
        };
      default:
        return outerReducer(state, action);
    }
  };
}

export function grid2Reducer(
  state: IGrid2State = GRID2_DEFAULT_STATE,
  action: IGrid2EventPayload
): IGrid2State {
  switch (action.type) {
    case Grid2Component.DESTROY_STATE:
      return { ...GRID2_DEFAULT_STATE };

    case Grid2Component.PAGE_SIZE:
      return {
        ...state,
        selectedRows: [],
        currentPage: GRID2_DEFAULT_STATE.currentPage,
        pageSize: (action.payload as number)
      };

    case Grid2Component.FIRST_PAGE:
      return {
        ...state,
        currentPage: 1
      };

    case Grid2Component.LAST_PAGE:
      return {
        ...state,
        currentPage: action.payload as number
      };

    case Grid2Component.PREVIOUS_PAGE:
      return {
        ...state,
        currentPage: (action.payload as number) - 1
      };

    case Grid2Component.NEXT_PAGE:
      return {
        ...state,
        currentPage: (action.payload as number) + 1
      };

    case Grid2Component.SELECTED_ROWS:
      const selectedRows = action.payload as IGrid2Selected;
      return {
        ...state,
        selectedRows: [...selectedRows]
      };

    case Grid2Component.GROUPING_COLUMNS:
      const groups = action.payload as IGrid2Groups;
      return {
        ...state,
        selectedRows: [],
        groups: [...groups]
      };

    case Grid2Component.SORTING_DIRECTION:
      const sorters = action.payload as IAGridSortModel[];
      return {
        ...state,
        sorters: [...sorters]
      };

    default:
      return state;
  }
}
