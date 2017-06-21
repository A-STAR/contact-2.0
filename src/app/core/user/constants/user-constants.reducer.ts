import { IUserConstantAction, IUserConstantsState } from './user-constants.interface';

import { UserConstantsService } from './user-constants.service';

const defaultState: IUserConstantsState = {
  constants: []
};

export function userConstantsReducer(state: IUserConstantsState = defaultState, action: IUserConstantAction): IUserConstantsState {
  switch (action.type) {
    case UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS:
      return {
        ...state,
        constants: action.payload.data
      };
    default:
      return state;
  }
};
