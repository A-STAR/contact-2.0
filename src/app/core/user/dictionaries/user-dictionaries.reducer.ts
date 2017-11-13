import { IUserDictionariesState } from './user-dictionaries.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserDictionariesService } from './user-dictionaries.service';

export const defaultState: IUserDictionariesState = {
  dictionaries: {},
};

export function reducer(
  state: IUserDictionariesState = defaultState,
  action: UnsafeAction
): IUserDictionariesState {
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
}
