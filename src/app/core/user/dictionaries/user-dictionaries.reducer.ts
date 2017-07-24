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
          [dictionaryId]: terms
        }
      };
    // TODO(d.maltsev): not a very good solution from UX perspective, since some values may dissappear
    // Better use retry for several times
    case UserDictionariesService.USER_DICTIONARY_FETCH_FAILURE:
      return {
        ...state,
        dictionaries: {
          ...state.dictionaries,
          [dictionaryId]: null
        }
      };
    default:
      return state;
  }
};
