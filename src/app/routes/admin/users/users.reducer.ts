import { Action } from '@ngrx/store';

import { IUsersState } from './users.interface';

import { UsersService } from './users.service';

const defaultState: IUsersState = {
  users: [],
  selectedUserId: null,
  dialogAction: null,
  displayBlocked: false,
  photo: null
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
    case UsersService.USER_DIALOG_ACTION:
      return {
        ...state,
        dialogAction: action.payload.dialogAction
      };
    case UsersService.USER_TOGGLE_BLOCKED:
      return {
        ...state,
        displayBlocked: !state.displayBlocked
      };
    case UsersService.USER_CHANGE_PHOTO:
      return {
        ...state,
        photo: action.payload.photo
      };
    default:
      return state;
  }
};
