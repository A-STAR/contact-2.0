import { Action } from '@ngrx/store';

import { ILookupState } from './lookup.interface';

// import { LookupService } from './lookup.service';

const defaultState: ILookupState = {
  roles: null,
  users: null,
  isResolved: null
};

export function lookupReducer(state: ILookupState = defaultState, action: Action): ILookupState {
  return state;
};
