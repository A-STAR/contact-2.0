import { Action, ActionReducer } from '@ngrx/store';

import { IAppState } from '../state/state.interface';
import { IAuthState } from './auth.interface';

import { AuthService } from './auth.service';

const defaultState: IAuthState = {
  token: null
};

export function authReducer(state: IAuthState = defaultState, action: Action): IAuthState {
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
};

export function resetReducer(reducer: ActionReducer<IAppState>): ActionReducer<IAppState> {
  return (state: IAppState, action: Action): IAppState => {
    return reducer(action.type === AuthService.AUTH_GLOBAL_RESET ? undefined : state, action);
  };
}
