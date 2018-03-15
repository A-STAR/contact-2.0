import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, first, tap, map } from 'rxjs/operators';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAppState } from '../state/state.interface';
import { ICallSettings, IPBXParams, ICall, IPBXState, PBXStateEnum } from './call.interface';
import { IWSConnection } from '@app/core/ws/ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';
import { WSService } from '@app/core/ws/ws.service';

import { combineLatestAnd } from '@app/core/utils';

@Injectable()
export class CallService {
  static STORAGE_KEY = 'state/calls';

  static CALL_INIT = 'CALL_INIT';
  static CALL_SETTINGS_FETCH = 'CALL_SETTINGS_FETCH';
  static CALL_SETTINGS_CHANGE = 'CALL_SETTINGS_CHANGE';
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

  static PBX_LOGIN = 'PBX_LOGIN';
  static PBX_LOGIN_SUCCESS = 'PBX_LOGIN_SUCCESS';
  static PBX_STATE_CHANGE = 'PBX_STATE_CHANGE';
  static PBX_STATUS_CHANGE = 'PBX_STATUS_CHANGE';
  static PBX_STATUS_CHANGE_SUCCESS = 'PBX_STATUS_CHANGE_SUCCESS';
  static PBX_PARAMS_UPDATE = 'PBX_PARAMS_UPDATE';
  static PBX_PARAMS_CHANGE = 'PBX_PARAMS_CHANGE';

  private isFetching = false;

  private wsConnection: IWSConnection<IPBXState>;

  constructor(
    private authService: AuthService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
    private persistenceService: PersistenceService,
    private wsService: WSService,
  ) {
    this.usePBX$
      .distinctUntilChanged()
      .filter(Boolean)
      .flatMap(() => this.wsService.connect<IPBXState>('/wsapi/pbx/events'))
      .do(connection => this.wsConnection = connection)
      .flatMap(connection => connection.listen())
      .subscribe(state => this.updatePBXState(state));

    this.usePBX$
      .filter(use => !use)
      .subscribe(() => this.wsConnection && this.wsConnection.close());

    this.store.select(state => state.calls)
      .pipe(throttleTime(500))
      .subscribe(state =>
        this.persistenceService.set(CallService.STORAGE_KEY, state)
      );
  }

  get settings$(): Observable<ICallSettings> {
    return combineLatest(
      this.authService.currentUser$.map(user => user && user.userId),
      this.store.select(state => state.calls.settings)
    )
    .pipe(
      tap(([userId, settings]) => {
        if (settings) {
          this.isFetching = false;
        } else if (!this.isFetching && userId) {
          this.refreshSettings();
        }
      }),
      map(([_, settings]) => settings),
      distinctUntilChanged()
    );
  }

  get params$(): Observable<IPBXParams> {
    return this.store.select(state => state.calls.params);
  }

  get usePBX$(): Observable<boolean> {
    return this.authService.userParams$
      .map(params => params && !!params.usePbx);
  }

  get pbxState$(): Observable<IPBXState> {
    return this.store.select(state => state.calls.pbxState);
  }

  get pbxStatus$(): Observable<number> {
    return combineLatestAnd([
      this.usePBX$,
      this.settings$.map(settings => settings && !!settings.useAgentStatus)
    ])
    .filter(Boolean)
    .flatMap(() => this.pbxState$)
    .filter(Boolean)
    .map(state => state.userStatus);
  }

  get pbxLineStatus$(): Observable<PBXStateEnum> {
    return this.pbxState$
      .map(state => state && state.lineStatus);
  }

  get activeCall$(): Observable<ICall> {
    return this.store.select(state => state.calls.activeCall);
  }

  get canMakeCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useMakeCall),
      this.pbxState$
        .map(pbxState => pbxState && pbxState.lineStatus === PBXStateEnum.PBX_NOCALL),
    ]);
  }

  get canDropCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.activeCall$.map(Boolean),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useDropCall),
      this.pbxState$
        .map(pbxState =>
          pbxState && [ PBXStateEnum.PBX_CALL, PBXStateEnum.PBX_HOLD, PBXStateEnum.PBX_DIAL ].indexOf(pbxState.lineStatus) > -1
        )
    ]);
  }

  get canHoldCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.activeCall$.map(Boolean),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useHoldCall),
      this.pbxState$
        .map(pbxState => pbxState && pbxState.lineStatus === PBXStateEnum.PBX_CALL)
    ]);
  }

  get canRetrieveCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.activeCall$.map(Boolean),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useRetrieveCall),
      this.pbxState$
        .map(pbxState => pbxState && pbxState.lineStatus === PBXStateEnum.PBX_HOLD)
    ]);
  }

  get canTransferCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.activeCall$.map(Boolean),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useTransferCall),
      this.pbxState$
        .map(pbxState => pbxState && [ PBXStateEnum.PBX_CALL, PBXStateEnum.PBX_HOLD ].indexOf(pbxState.lineStatus) > -1)
    ]);
  }

  refreshSettings(): void {
    this.isFetching = true;
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

  dropCall(): void {
    this.activeCall$
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_DROP,
        payload: call
      }));
  }

  holdCall(): void {
    this.activeCall$
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_HOLD,
        payload: call
      }));
  }

  retrieveCall(): void {
    this.activeCall$
      .pipe(first())
      .subscribe(call => this.store.dispatch({
        type: CallService.CALL_RETRIEVE,
        payload: call
      }));
  }

  transferCall(userId: number): void {
    this.activeCall$
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

  updatePBXParams(params: IPBXParams): void {
    this.store.dispatch({
      type: CallService.PBX_PARAMS_UPDATE,
      payload: params
    });
  }

  changePBXParams(params: IPBXParams): void {
    this.store.dispatch({
      type: CallService.PBX_PARAMS_CHANGE,
      payload: params
    });
  }

  private updatePBXState(pbxState: IPBXState): void {
    this.store.dispatch({
      type: CallService.PBX_STATE_CHANGE,
      payload: pbxState
    });
  }
}
