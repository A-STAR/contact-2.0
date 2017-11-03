import { IUserConstantsState } from './user-constants.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserConstantsService } from './user-constants.service';

const defaultState: IUserConstantsState = {
  constants: null
};

function reducer(state: IUserConstantsState = defaultState, action: UnsafeAction): IUserConstantsState {
  switch (action.type) {
    case UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS:
      return {
        ...state,
        constants: action.payload.data,
      };
    default:
      return state;
  }
}

const userConstants = {
  defaultState,
  reducer,
};

export default userConstants;
