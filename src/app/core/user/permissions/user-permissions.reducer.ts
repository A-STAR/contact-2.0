import { Action } from '@ngrx/store';

import { IUserPermissionsState } from './user-permissions.interface';

import { UserPermissionsService } from './user-permissions.service';

const defaultState: IUserPermissionsState = {
  permissions: null
};

export function userPermissionsReducer(state: IUserPermissionsState = defaultState, action: Action): IUserPermissionsState {
  switch (action.type) {
    case UserPermissionsService.USER_PERMISSIONS_FETCH_SUCCESS:
      return {
        ...state,
        permissions: action.payload.data,
      };
    default:
      return state;
  }
};
