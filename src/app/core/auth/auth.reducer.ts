import { Action, ActionReducer } from '@ngrx/store';
import * as R from 'ramda';

import { IAppState } from '../state/state.interface';
import { IAuthState } from './auth.interface';

import { AuthService } from './auth.service';

const savedToken = localStorage.getItem(AuthService.TOKEN_NAME);

const defaultState: IAuthState = {
  token: null
};

export function authReducer(
  state: IAuthState = R.tryCatch(token => ({ token: JSON.parse(token) }), () => defaultState)(savedToken),
  action: Action
): IAuthState {
  switch (action.type) {
    case AuthService.AUTH_CREATE_SESSION:
      return {
        ...state,
        token: action.payload.token
      };
    case AuthService.AUTH_DESTROY_SESSION:
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
}

export function resetReducer(reducer: ActionReducer<IAppState>): ActionReducer<IAppState> {
  return (state: IAppState, action: Action): IAppState => {
    return reducer(action.type === AuthService.AUTH_GLOBAL_RESET ? undefined : state, action);
  };
}
