import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged, first, tap } from 'rxjs/operators';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { catchError } from 'rxjs/operators/catchError';

import { IAppState } from '../state/state.interface';
import { ICallSettings, IPBXParams, ICall, IPBXState, PBXStateEnum } from './call.interface';
import { IWSConnection } from '@app/core/ws/ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';
import { WSService } from '@app/core/ws/ws.service';

import { combineLatestAnd } from '@app/core/utils';

@Injectable()
export class CallService implements OnDestroy {
  static STORAGE_KEY = 'state/calls';

  static CALL_INIT = 'CALL_INIT';
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

  static PBX_STATE_CHANGE = 'PBX_STATE_DATA';
  static PBX_STATUS_CHANGE = 'PBX_STATUS_CHANGE';
  static PBX_STATUS_CHANGE_SUCCESS = 'PBX_STATUS_CHANGE_SUCCESS';

  private isFetching = false;

  private wsConnection: IWSConnection<IPBXState>;

  private stateSub: Subscription;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
    private persistenceService: PersistenceService,
    private wsService: WSService,
  ) {
    this.wsService.connect<IPBXState>('/wsapi/pbx/events')
      .do(connection => this.wsConnection = connection)
      .flatMap(connection => connection.listen())
      .subscribe(state => this.updatePBXState(state));

    this.stateSub = this.store.select(state => state.calls)
      .pipe(throttleTime(500))
      .subscribe(state =>
        this.persistenceService.set(CallService.STORAGE_KEY, state)
      );
  }

  ngOnDestroy(): void {
    this.stateSub.unsubscribe();
    this.wsConnection.close();
  }

  get settings$(): Observable<ICallSettings> {
    return this.store
      .select(state => state.calls.settings)
      .pipe(
        tap(settings => {
          if (settings) {
            this.isFetching = false;
          } else if (!this.isFetching) {
            this.refreshSettings();
          }
        }),
        distinctUntilChanged(),
      );
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
      this.settings$.map(settings => settings && !settings.useAgentStatus)
    ])
    .flatMap(() => this.pbxState$)
    .filter(Boolean)
    .map(state => state.agentStatus);
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
        .filter(Boolean)
        .map(({ lineStatus }) => lineStatus === PBXStateEnum.PBX_NOCALL),
    ]);
  }

  get canDropCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useDropCall),
      this.pbxState$
        .filter(Boolean)
        .map(({ lineStatus }) =>
          [ PBXStateEnum.PBX_CALL, PBXStateEnum.PBX_HOLD, PBXStateEnum.PBX_DIAL ].indexOf(lineStatus) > -1
        )
    ]);
  }

  get canHoldCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useHoldCall),
      this.pbxState$
        .filter(Boolean)
        .map(({ lineStatus }) => lineStatus === PBXStateEnum.PBX_CALL)
    ]);
  }

  get canRetrieveCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useRetrieveCall),
      this.pbxState$
        .filter(Boolean)
        .map(({ lineStatus }) => lineStatus === PBXStateEnum.PBX_HOLD)
    ]);
  }

  get canTransferCall$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('PBX_PREVIEW'),
      this.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useTransferCall),
      this.pbxState$
        .filter(Boolean)
        .map(({ lineStatus }) => [ PBXStateEnum.PBX_CALL, PBXStateEnum.PBX_HOLD ].indexOf(lineStatus) > -1)
    ]);
  }

  refreshSettings(): void {
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

  private updatePBXState(pbxState: IPBXState): void {
    this.store.dispatch({
      type: CallService.PBX_STATE_CHANGE,
      payload: pbxState
    });
  }
}
