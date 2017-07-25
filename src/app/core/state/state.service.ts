import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState, ISliceCallback } from '../state/state.interface';

@Injectable()
export class StateService {
  static STORAGE_KEY = 'state';

  // TODO(d.maltsev): merge this with AuthService.AUTH_GLOBAL_RESET
  static STORAGE_INIT = 'AUTH_GLOBAL_RESET';

  constructor(private store: Store<IAppState>) {}

  initState(): void {
    try {
      const payload = this.getItem(StateService.STORAGE_KEY);
      this.store.dispatch({ type: StateService.STORAGE_INIT, payload });
    } catch (error) {
      // TODO(d.maltsev): notification
      console.error('Could not parse state.');
    }
  }

  saveState(sliceCallback: ISliceCallback = this.defaultSliceCallback): void {
    this.store
      .take(1)
      .map(sliceCallback)
      .subscribe(state => this.setItem(StateService.STORAGE_KEY, state));
  }

  clear(): void {
    this.getKeys()
      .filter(key => !key.startsWith('auth/'))
      .forEach(key => this.removeItem(key));

    this.initState();
  }

  get(key: string): any {
    return this.getItem(key);
  }

  set(key: string, value: any): void {
    this.setItem(key, value);
  }

  remove(key: string): void {
    this.removeItem(key);
  }

  private defaultSliceCallback: ISliceCallback = state => ({
    auth: state.auth,
    notifications: state.notifications
  });

  private getKeys(): Array<string> {
    return Object.keys(localStorage);
  }

  private getItem(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      // TODO(d.maltsev): notification
      return null;
    }
  }

  private setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // TODO(d.maltsev): notification
    }
  }

  private removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
