import { Action } from '@ngrx/store';

import { IUserDictionariesState } from './user-dictionaries.interface';

import { UserDictionariesService } from './user-dictionaries.service';

const defaultState: IUserDictionariesState = {
  dictionaries: {},
};

export function userDictionariesReducer(state: IUserDictionariesState = defaultState, action: Action): IUserDictionariesState {
  switch (action.type) {
    case UserDictionariesService.USER_DICTIONARY_FETCH_SUCCESS:
      const { dictionaryId, terms } = action.payload;
      return {
        dictionaries: {
          ...state.dictionaries,
          [dictionaryId]: terms
        }
      };
    // NOTE: this should fall back to default
    // case UserDictionariesService.USER_DICTIONARY_FETCH_FAILURE:
    default:
      return state;
  }
};
