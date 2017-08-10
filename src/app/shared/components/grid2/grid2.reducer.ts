import {
  IAGridEventPayload,
  IAGridState
} from './grid2.interface';

import { Grid2Component } from './grid2.component';

export const AGRID_DEFAULT_STATE: IAGridState = {
  currentPage: 1,
  pageSize: Grid2Component.DEFAULT_PAGE_SIZE,
  sorters: [],
  groups: [],
  selectedRows: [],
};

export function combineWithAGridReducer(stateKey: string, ownReducer: Function): Function {
  return function (state: any, action: { type: any }): any {
    switch (action.type) {
      case Grid2Component.DESTROY_STATE:
      // case Grid2Component.GROUP_COLUMNS:
      // case Grid2Component.NEXT_PAGE:
      // case Grid2Component.PAGE_SIZE:
      // case Grid2Component.PREVIOUS_PAGE:
      // case Grid2Component.FIRST_PAGE:
      // case Grid2Component.LAST_PAGE:
      // case Grid2Component.SELECTED_ROWS:
      // case Grid2Component.SORT_COLUMNS:
        return {
          ...state,
          [stateKey]: AGridReducer(state[stateKey], action as IAGridEventPayload)
        };
      default:
        return ownReducer(state, action);
    }
  };
}

function AGridReducer(state: IAGridState = AGRID_DEFAULT_STATE, action: IAGridEventPayload): IAGridState {
  switch (action.type) {
    case Grid2Component.DESTROY_STATE:
      return { ...AGRID_DEFAULT_STATE };

    // case Grid2Component.PAGE_SIZE:
    //   return {
    //     ...state,
    //     selectedRows: [],
    //     currentPage: AGRID_DEFAULT_STATE.currentPage,
    //     pageSize: (action.payload as number)
    //   };

    // case Grid2Component.FIRST_PAGE:
    //   return {
    //     ...state,
    //     currentPage: 1
    //   };

    // case Grid2Component.LAST_PAGE:
    //   return {
    //     ...state,
    //     currentPage: action.payload as number
    //   };

    // case Grid2Component.PREVIOUS_PAGE:
    //   return {
    //     ...state,
    //     currentPage: (action.payload as number) - 1
    //   };

    // case Grid2Component.NEXT_PAGE:
    //   return {
    //     ...state,
    //     currentPage: (action.payload as number) + 1
    //   };

    // case Grid2Component.SELECTED_ROWS:
    //   const selectedRows = action.payload as IAGridSelected;
    //   return {
    //     ...state,
    //     selectedRows: [...selectedRows]
    //   };

    // case Grid2Component.GROUP_COLUMNS:
    //   const groups = action.payload as IAGridGroups;
    //   return {
    //     ...state,
    //     selectedRows: [],
    //     groups: [...groups]
    //   };

    // case Grid2Component.SORT_COLUMNS:
    //   const sorters = action.payload as IAGridSortModel[];
    //   return {
    //     ...state,
    //     sorters: [...sorters]
    //   };

    default:
      return state;
  }
}
