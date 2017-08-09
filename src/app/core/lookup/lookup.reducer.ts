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
  if (action.type === LookupService.LOOKUP_FETCH_SUCCESS) {
    const { key, data } = action.payload;
    return {
      ...state,
      [key]: data
    }
  }
  return state;
};
