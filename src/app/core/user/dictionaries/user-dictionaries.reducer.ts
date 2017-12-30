import { IUserDictionariesState, IUserDictionaryAction } from './user-dictionaries.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { UserDictionariesService } from './user-dictionaries.service';

export const defaultState: IUserDictionariesState = {};

export function reducer(
  state: IUserDictionariesState = defaultState,
  action: SafeAction<IUserDictionaryAction>
): IUserDictionariesState {
  switch (action.type) {

    case UserDictionariesService.USER_DICTIONARY_FETCH_SUCCESS:
      const { dictionaryId, terms } = action.payload;
      return {
        ...state,
        [dictionaryId]: terms
      };

    default:
      return state;
  }
}
