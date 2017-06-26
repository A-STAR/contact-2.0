import { Action } from '@ngrx/store';

import { IUserDictionariesState } from './user-dictionaries.interface';

import { UserDictionariesService } from './user-dictionaries.service';

const defaultState: IUserDictionariesState = {
  dictionaries: {}
};

export function userDictionariesReducer(state: IUserDictionariesState = defaultState, action: Action): IUserDictionariesState {
  switch (action.type) {
    case UserDictionariesService.USER_DICTIONARY_FETCH_SUCCESS:
      const { dictionaryId, terms } = action.payload;
      return {
        ...state,
        dictionaries: {
          ...state.dictionaries,
          [dictionaryId]: {
            terms,
            isResolved: true
          }
        }
      };
    case UserDictionariesService.USER_DICTIONARY_FETCH_FAILURE:
      return {
        ...state,
        dictionaries: {
          ...state.dictionaries,
          [dictionaryId]: {
            terms: [],
            isResolved: false
          }
        }
      };
    default:
      return state;
  }
};
