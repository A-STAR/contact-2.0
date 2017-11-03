import { ILookupState, LookupStatusEnum } from './lookup.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { LookupService } from './lookup.service';

const defaultState: ILookupState = {
  contractors: null,
  currencies: null,
  dictionaries: null,
  languages: null,
  portfolios: null,
  roles: null,
  users: null,
};

function reducer(state: ILookupState = defaultState, action: UnsafeAction): ILookupState {
  switch (action.type) {
    case LookupService.LOOKUP_FETCH: {
      const { key } = action.payload;
      return {
        ...state,
        [key]: {
          status: LookupStatusEnum.PENDING
        }
      };
    }
    case LookupService.LOOKUP_FETCH_SUCCESS: {
      const { key, data } = action.payload;
      return {
        ...state,
        [key]: {
          data,
          status: LookupStatusEnum.LOADED
        }
      };
    }
    case LookupService.LOOKUP_FETCH_FAILURE: {
      const { key } = action.payload;
      return {
        ...state,
        [key]: {
          status: LookupStatusEnum.ERROR
        }
      };
    }
    default:
      return state;
  }
}

const lookup = {
  defaultState,
  reducer,
};

export default lookup;
