import { Action } from '@ngrx/store';

import { ILookupState } from './lookup.interface';

import { LookupService } from './lookup.service';

const defaultState: ILookupState = {
  currencies: null,
  languages: null,
  roles: null,
  users: null,
};

export function lookupReducer(state: ILookupState = defaultState, action: Action): ILookupState {
  switch (action.type) {
    case LookupService.LOOKUP_CURRENCIES_FETCH_SUCCESS:
      return {
        ...state,
        currencies: action.payload.currencies
      };
    case LookupService.LOOKUP_LANGUAGES_FETCH_SUCCESS:
      return {
        ...state,
        languages: action.payload.languages
      };
    case LookupService.LOOKUP_ROLES_FETCH_SUCCESS:
      return {
        ...state,
        roles: action.payload.roles
      };
    case LookupService.LOOKUP_USERS_FETCH_SUCCESS:
      return {
        ...state,
        users: action.payload.users
      };
    default:
      return state;
  }
};
