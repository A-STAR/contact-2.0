import { Action } from '@ngrx/store';

import { ILookupState } from './lookup.interface';

import { LookupService } from './lookup.service';

const defaultState: ILookupState = {
  roles: [],
  rolesResolved: null,
  users: [],
  usersResolved: null
};

export function lookupReducer(state: ILookupState = defaultState, action: Action): ILookupState {
  switch (action.type) {
    case LookupService.LOOKUP_ROLES_FETCH_SUCCESS:
      return {
        ...state,
        roles: action.payload.roles,
        rolesResolved: true
      };
    case LookupService.LOOKUP_ROLES_FETCH_FAILURE:
      return {
        ...state,
        roles: [],
        rolesResolved: false
      };
    case LookupService.LOOKUP_USERS_FETCH_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
        usersResolved: true
      };
    case LookupService.LOOKUP_USERS_FETCH_FAILURE:
      return {
        ...state,
        users: [],
        usersResolved: false
      };
    default:
      return state;
  }
};
