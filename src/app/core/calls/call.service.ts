import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, filter, distinctUntilChanged, first } from 'rxjs/operators';

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
  static CALL_DROP = 'CALL_DROP';
  static CALL_DROP_SUCCESS = 'CALL_DROP_SUCCESS';
  static CALL_DROP_FAILURE = 'CALL_DROP_FAILURE';
  static CALL_HOLD = 'CALL_HOLD';
  static CALL_HOLD_SUCCESS = 'CALL_HOLD_SUCCESS';
  static CALL_HOLD_FAILURE = 'CALL_HOLD_FAILURE';
  static CALL_RETRIEVE = 'CALL_RETRIEVE';
  static CALL_RETRIEVE_SUCCESS = 'CALL_RETRIEVE_SUCCESS';
  static CALL_RETRIEVE_FAILURE = 'CALL_RETRIEVE_FAILURE';
  static CALL_TRANSFER = 'CALL_TRANSFER';
  static CALL_TRANSFER_SUCCESS = 'CALL_TRANSFER_SUCCESS';
  static CALL_TRANSFER_FAILURE = 'CALL_TRANSFER_FAILURE';

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

  get calls$(): Observable<ICall[]> {
    return this.state$.map(state => state.calls);
  }

  findPhoneCall(phoneId: number): Observable<ICall> {
    return this.calls$
      .map(calls => calls.find(call => call.phoneId === phoneId));
  }

  findCall(callId: number): Observable<ICall> {
    return this.calls$
      .map(calls => calls.find(call => call.id === callId));
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

  dropCall(callId: number): void {
    this.findCall(callId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_DROP,
        payload: call
      }));
  }

  holdCall(callId: number): void {
    this.findCall(callId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_HOLD,
        payload: call
      }));
  }

  retrieveCall(callId: number): void {
    this.findCall(callId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_RETRIEVE,
        payload: call
      }));
  }

  transferCall(callId: number, userId: number): void {
    this.findCall(callId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_TRANSFER,
        payload: { userId, ...call }
      }));
  }

  private get state$(): Observable<ICallState> {
    return this.store.select(state => state.calls)
      .pipe(
        distinctUntilChanged()
      );
  }
}
