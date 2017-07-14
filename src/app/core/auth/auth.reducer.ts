import { Action, ActionReducer } from '@ngrx/store';

import { IAppState } from '../state/state.interface';

import { AuthService } from './auth.service';

export function authReducer(reducer: ActionReducer<IAppState>): ActionReducer<IAppState> {
  return (state: IAppState, action: Action): IAppState => {
    return reducer(action.type === AuthService.GLOBAL_RESET ? undefined : state, action);
  };
}
