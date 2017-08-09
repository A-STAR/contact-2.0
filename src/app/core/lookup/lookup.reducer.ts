import { Action } from '@ngrx/store';

import { ILookupState, LookupStatusEnum } from './lookup.interface';

import { LookupService } from './lookup.service';

const defaultState: ILookupState = {
  currencies: null,
  languages: null,
  portfolios: null,
  roles: null,
  users: null,
};

export function lookupReducer(state: ILookupState = defaultState, action: Action): ILookupState {
  switch (action.type) {
    case LookupService.LOOKUP_FETCH_SUCCESS:
      const { key, data } = action.payload;
      return {
        ...state,
        [key]: {
          data,
          status: LookupStatusEnum.LOADED
        }
      };
    case LookupService.LOOKUP_FETCH_FAILURE:
      return {
        ...state,
        [key]: {
          status: LookupStatusEnum.ERROR
        }
      }
    default:
      return state;
  }
};
