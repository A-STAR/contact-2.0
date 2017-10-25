import { Action } from '@ngrx/store';

import { IUsersState } from './users.interface';

import { UsersService } from './users.service';

const defaultState: IUsersState = {
  selectedUserId: null,
  displayInactive: false
};

export function usersReducer(state: IUsersState = defaultState, action: Action): IUsersState {
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
