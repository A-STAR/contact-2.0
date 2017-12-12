import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { IAppState, SafeAction } from './state.interface';

export abstract class AbstractActionService {

  protected abstract actions: Actions;
  protected abstract store: Store<IAppState>;

  dispatchAction<T>(type: string, payload: T = null): void {
    const action: SafeAction<T> = { type, payload };
    return this.store.dispatch(action);
  }

  getAction(action: string): Actions<any> {
    return this.actions.ofType(action);
  }
}
