import * as R from 'ramda';

import { UnsafeAction } from '../../core/state/state.interface';
import { IAuthState } from './auth.interface';

import { AuthService } from './auth.service';

const savedToken = localStorage.getItem(AuthService.TOKEN_NAME);

export const defaultState: IAuthState = {
  token: null
};

function parseToken(token: string): IAuthState {
  return { token: JSON.parse(token) };
}

function getDefaultState(): IAuthState {
  return defaultState;
}

export function reducer(
  state: IAuthState = R.tryCatch(parseToken, getDefaultState)(savedToken),
  action: UnsafeAction
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

export const auth = {
  defaultState,
  reducer,
};
