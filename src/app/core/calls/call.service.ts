import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '../state/state.interface';
import { ICallState, CallStateStatusEnum, ICallSettings, ICall } from './call.interface';

@Injectable()
export class CallService {
  static CALL_SETTINGS_FETCH = 'CALL_SETTINGS_FETCH';
  static CALL_SETTINGS_FETCH_SUCCESS = 'CALL_SETTINGS_FETCH_SUCCESS';
  static CALL_SETTINGS_FETCH_FAILURE = 'CALL_SETTINGS_FETCH_FAILURE';
  static CALL_START = 'CALL_START';
  static CALL_START_SUCCESS = 'CALL_START_SUCCESS';
  static CALL_START_FAILURE = 'CALL_START_FAILURE';

  private state: ICallState;

  constructor(
    private store: Store<IAppState>,
  ) {
    this.state$.subscribe(state => this.state = state);
  }

  get settings$(): Observable<ICallSettings> {
    const status = this.state && this.state.status;
    if (status !== CallStateStatusEnum.LOADED && status !== CallStateStatusEnum.PENDING) {
      this.refresh();
    }
    return this.state$
      .pipe(
        filter(state => state.status !== CallStateStatusEnum.PENDING),
        map(state => state.settings)
      );
  }

  get call$(): Observable<ICall> {
    return this.state$.map(state => state.call);
  }

  refresh(): void {
    this.store.dispatch({
      type: CallService.CALL_SETTINGS_FETCH,
    });
  }

  makeCall(phoneId: number, debtId: number, personId: number, personRole: number): void {
    this.store.dispatch({
      type: CallService.CALL_START,
      payload: { phoneId, debtId, personId, personRole }
    });
  }

  private get state$(): Observable<ICallState> {
    return this.store.select(state => state.calls)
      .pipe(
        distinctUntilChanged()
      );
  }
}
