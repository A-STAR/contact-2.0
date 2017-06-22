import { Action } from '@ngrx/store';

import { IUserPermissionsState } from './user-permissions.interface';

import { UserPermissionsService } from './user-permissions.service';

const defaultState: IUserPermissionsState = {
  permissions: {},
  isResolved: null
};

export function userPermissionsReducer(state: IUserPermissionsState = defaultState, action: Action): IUserPermissionsState {
  switch (action.type) {
    case UserPermissionsService.USER_PERMISSIONS_FETCH_SUCCESS:
      return {
        ...state,
        permissions: action.payload.data,
        isResolved: true
      };
    case UserPermissionsService.USER_PERMISSIONS_FETCH_FAILURE:
      return {
        ...state,
        isResolved: false
      };
    default:
      return state;
  }
};
