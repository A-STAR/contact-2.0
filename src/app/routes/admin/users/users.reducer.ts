import { Action } from '@ngrx/store';

import { IUsersState } from './users.interface';

import { UsersService } from './users.service';

const defaultState: IUsersState = {
  users: [],
  selectedUserId: null,
  displayInactive: false
};

export function usersReducer(state: IUsersState = defaultState, action: Action): IUsersState {
  switch (action.type) {
    case UsersService.USERS_FETCH_SUCCESS:
      return {
        ...state,
        users: action.payload.users
      };
    case UsersService.USER_SELECT:
      return {
        ...state,
        selectedUserId: action.payload.userId
      };
    case UsersService.USERS_CLEAR:
      return {
        ...state,
        users: [],
        selectedUserId: null
      };
    case UsersService.USER_TOGGLE_INACTIVE:
      return {
        ...state,
        displayInactive: !state.displayInactive
      };
    default:
      return state;
  }
};
