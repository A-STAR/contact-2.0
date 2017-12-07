import { SafeAction } from '../../core/state/state.interface';
import { IAuthState } from './auth.interface';

import { AuthService } from './auth.service';

// const savedToken = localStorage.getItem(AuthService.TOKEN_NAME);

export const defaultState: IAuthState = {
  token: null
};

export function reducer(
  state: IAuthState = defaultState,
  action: SafeAction<IAuthState>
): IAuthState {
  switch (action.type) {
    case AuthService.AUTH_CREATE_SESSION:
      return {
        token: action.payload.token
      };

    case AuthService.AUTH_RETRIEVE_TOKEN:
      return {
        token: action.payload.token
      };

    case AuthService.AUTH_DESTROY_SESSION:
      return {
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
