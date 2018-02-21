import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, first, tap } from 'rxjs/operators';

import { IAppState } from '../state/state.interface';
import { ICallSettings, IPBXParams, ICall } from './call.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { catchError } from 'rxjs/operators/catchError';

import { combineLatestAnd } from '@app/core/utils';

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

  static PBX_STATUS_CHANGE = 'PBX_STATUS_CHANGE';
  static PBX_STATUS_CHANGE_SUCCESS = 'PBX_STATUS_CHANGE_SUCCESS';

  private isFetching = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private store: Store<IAppState>,
  ) { }

  get settings$(): Observable<ICallSettings> {
    return this.store
      .select(state => state.calls.settings)
      .pipe(
        tap(settings => {
          if (settings) {
            this.isFetching = false;
          } else if (!this.isFetching) {
            this.refresh();
          }
        }),
        distinctUntilChanged(),
      );
  }

  get usePBX$(): Observable<boolean> {
    return this.authService.userParams$
      .map(params => params && !!params.usePbx);
  }

  get calls$(): Observable<ICall[]> {
    return this.store
      .select(state => state.calls.calls);
  }

  get usePBXStatus$(): Observable<boolean> {
    return combineLatestAnd([
      this.usePBX$,
      this.settings$.map(settings => settings && !!settings.useAgentStatus)
    ]);
  }

  get pbxStatus$(): Observable<number> {
    return this.store
      .select(state => state.calls.statusCode);
  }

  findCall(phoneId: number): Observable<ICall> {
    return this.calls$
      .map(calls => calls.find(call => call.phoneId === phoneId));
  }

  refresh(): void {
    this.isFetching = true;
    this.store.dispatch({
      type: CallService.CALL_SETTINGS_FETCH,
    });
  }

  updatePBXParams(params: IPBXParams): Observable<void> {
    return this.dataService
      .update('/pbx/users', {}, params)
      .pipe(
        catchError(this.notificationService.updateError().entity('entities.callSettings.gen.plural').dispatchCallback()),
      );
  }

  makeCall(phoneId: number, debtId: number, personId: number, personRole: number): void {
    this.store.dispatch({
      type: CallService.CALL_START,
      payload: { phoneId, debtId, personId, personRole }
    });
  }

  dropCall(phoneId: number): void {
    this.findCall(phoneId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_DROP,
        payload: call
      }));
  }

  holdCall(phoneId: number): void {
    this.findCall(phoneId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_HOLD,
        payload: call
      }));
  }

  retrieveCall(phoneId: number): void {
    this.findCall(phoneId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_RETRIEVE,
        payload: call
      }));
  }

  transferCall(phoneId: number, userId: number): void {
    this.findCall(phoneId)
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_TRANSFER,
        payload: { userId, ...call }
      }));
  }

  changeBPXStatus(statusCode: number): void {
    this.store.dispatch({
      type: CallService.PBX_STATUS_CHANGE,
      payload: { statusCode }
    });
  }
}
