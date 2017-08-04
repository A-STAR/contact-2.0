import { Action } from '@ngrx/store';

import { IUserLanguagesState } from './user-languages.interface';

import { UserLanguagesService } from './user-languages.service';

const defaultState: IUserLanguagesState = {
  languages: null,
};

export function userLanguagesReducer(state: IUserLanguagesState = defaultState, action: Action): IUserLanguagesState {
  switch (action.type) {
    case UserLanguagesService.USER_LANGUAGES_FETCH_SUCCESS:
      return {
        ...state,
        languages: action.payload.data,
      };
    default:
      return state;
  }
};
