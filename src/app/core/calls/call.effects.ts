import * as R from 'ramda';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import { ICallSettings, ICall, PBXStateEnum } from './call.interface';
import { UnsafeAction } from '@app/core/state/state.interface';

import { CallService } from './call.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';

import { first } from 'rxjs/operators';

const savedState = localStorage.getItem(CallService.STORAGE_KEY);

@Injectable()
export class CallEffects {

  @Effect()
  init$ = defer(() => of({
    type: CallService.CALL_INIT,
    payload: R.tryCatch(JSON.parse, () => ({}))(savedState || undefined)
  }));

  @Effect()
  fetchCallSettings$ = this.actions
    .ofType(CallService.CALL_SETTINGS_FETCH)
    .mergeMap(() => {
      return this.read()
        .map(settings => ({
          type: CallService.CALL_SETTINGS_FETCH_SUCCESS,
          payload: settings
        }))
        .catch(error => {
          return [
            { type: CallService.CALL_SETTINGS_FETCH_FAILURE },
            this.notificationService.fetchError().entity('entities.callSettings.gen.plural').response(error).action()
          ];
        });
    });

  @Effect()
  makeCall$ = this.actions
    .ofType(CallService.CALL_START)
    .switchMap((action: UnsafeAction) => {
      const { phoneId, debtId, personId, personRole } = action.payload;
      return this.call(phoneId, debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_START_SUCCESS,
          payload: { phoneId, debtId, personId, personRole }
        }))
        .catch(error => {
          return [
            { type: CallService.CALL_START_FAILURE },
            this.notificationService.createError().entity('entities.calls.gen.singular').response(error).action()
          ];
        });
    });

  @Effect()
  dropCall$ = this.actions
    .ofType(CallService.CALL_DROP)
    .switchMap((action: UnsafeAction) => {
      const { debtId, personId, personRole } = action.payload;
      return this.drop(debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_DROP_SUCCESS,
          payload: action.payload
        }))
        .catch(error => {
          return [
            {
              type: CallService.CALL_DROP_FAILURE,
              payload: action.payload
            },
            this.notificationService
              .error('widgets.phone.errors.drop')
              .entity('entities.calls.gen.singular')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  holdCall$ = this.actions
    .ofType(CallService.CALL_HOLD)
    .switchMap((action: UnsafeAction) => {
      const { debtId, personId, personRole } = action.payload;
      return this.hold(debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_HOLD_SUCCESS,
          payload: action.payload
        }))
        .catch(error => {
          return [
            {
              type: CallService.CALL_HOLD_FAILURE,
              payload: action.payload
            },
            this.notificationService
              .error('widgets.phone.errors.hold')
              .entity('entities.calls.gen.singular')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  retrieveCall$ = this.actions
    .ofType(CallService.CALL_RETRIEVE)
    .switchMap((action: UnsafeAction) => {
      const { debtId, personId, personRole } = action.payload;
      return this.retrieve(debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_RETRIEVE_SUCCESS,
          payload: action.payload
        }))
        .catch(error => {
          return [
            {
              type: CallService.CALL_RETRIEVE_FAILURE,
              payload: action.payload
            },
            this.notificationService
              .error('widgets.phone.errors.retrieve')
              .entity('entities.calls.gen.singular')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  transferCall$ = this.actions
    .ofType(CallService.CALL_TRANSFER)
    .switchMap((action: UnsafeAction) => {
      const { userId, debtId, personId, personRole } = action.payload;
      return this.transfer(userId, debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_TRANSFER_SUCCESS,
          payload: action.payload
        }))
        .catch(error => {
          return [
            {
              type: CallService.CALL_TRANSFER_FAILURE,
              payload: action.payload
            },
            this.notificationService
              .error('widgets.phone.errors.transfer')
              .entity('entities.calls.gen.singular')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  login$ = this.actions
    .ofType(CallService.PBX_LOGIN)
    .map((action: UnsafeAction) => action.payload)
    .filter(userParams => userParams.usePbx)
    .flatMap(() => this.callService.settings$)
    .filter(Boolean)
    .pipe(first())
    .filter(settings => !settings.useIntPhone)
    .switchMap(() => {
      return this.login()
        .map(() => ({
          type: CallService.PBX_LOGIN_SUCCESS,
        }))
        .catch(error => {
          return [
            this.notificationService
              .createError()
              .entity('entities.calls.gen.plural')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  changeStatus$ = this.actions
    .ofType(CallService.PBX_STATUS_CHANGE)
    .switchMap((action: UnsafeAction) => {
      const { statusCode } = action.payload;
      return this.changeStatus(statusCode)
        .map(() => ([{
          type: CallService.PBX_STATUS_CHANGE_SUCCESS,
          payload: action.payload
        }]))
        .catch(error => {
          return [
            this.notificationService
              .updateError()
              .entity('entities.status.gen.singular')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  stateChange$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .map((action: UnsafeAction) => action.payload)
    .filter(Boolean)
    .withLatestFrom(this.callService.activeCall$)
    .filter(([ pbxState, call ]) => call && pbxState.lineStatus === PBXStateEnum.PBX_NOCALL)
    .map(() => ({ type: CallService.CALL_DROP_SUCCESS }));

  constructor(
    private actions: Actions,
    private callService: CallService,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {}

  private read(): Observable<ICallSettings> {
    return this.dataService.read('/pbx/settings')
      // TODO (i.kibisov): remove mock
      .map(settings => ({ ...settings, useAgentStatus: 1 }));
  }

  private login(): Observable<void> {
    return this.dataService.get('/pbx/call/make');
  }

  private call(phoneId: number, debtId: number, personId: number, personRole: number): Observable<ICall> {
    return this.dataService
      .create('/pbx/call/make', { }, { phoneId, debtId, personId, personRole });
  }

  private drop(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('/pbx/call/drop', {}, { debtId, personId, personRole });
  }

  private hold(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('/pbx/call/hold', {}, { debtId, personId, personRole });
  }

  private retrieve(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('/pbx/call/retrieve', {}, { debtId, personId, personRole });
  }

  private transfer(userId: number, debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('/pbx/call/transfer', {}, { userId, debtId, personId, personRole });
  }

  private changeStatus(statusCode: number): Observable<void> {
    return this.dataService
      .update('/pbx/users/status', {}, { statusCode });
  }
}
