import { Action } from '@ngrx/store';

import { IUserConstantsState } from './user-constants.interface';

import { UserConstantsService } from './user-constants.service';

const defaultState: IUserConstantsState = {
  constants: [],
  isResolved: null
};

export function userConstantsReducer(state: IUserConstantsState = defaultState, action: Action): IUserConstantsState {
  switch (action.type) {
    case UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS:
      return {
        ...state,
        constants: action.payload.data,
        isResolved: true
      };
    case UserConstantsService.USER_CONSTANTS_FETCH_FAILURE:
      return {
        ...state,
        isResolved: false
      };
    default:
      return state;
  }
};
