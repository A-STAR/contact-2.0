
import { IUsersState } from './users.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UsersService } from './users.service';

export const defaultState: IUsersState = {
  selectedUserId: null,
  displayInactive: false
};

export function reducer(state: IUsersState = defaultState, action: UnsafeAction): IUsersState {
  switch (action.type) {
    case UsersService.USER_SELECT:
      return {
        ...state,
        selectedUserId: action.payload.userId
      };
    case UsersService.USER_TOGGLE_INACTIVE:
      return {
        ...state,
        displayInactive: !state.displayInactive
      };
    default:
      return state;
  }
}
