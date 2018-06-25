import * as R from 'ramda';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICallSettings, ICall, PBXStateEnum, IPBXParams, CallTypeEnum } from './call.interface';
import { UnsafeAction } from '@app/core/state/state.interface';

import { Person } from '@app/entities';

import { AuthService } from '@app/core/auth/auth.service';
import { CallService } from './call.service';
import { DataService } from '../data/data.service';
import { DebtApiService } from '@app/core/api/debt.api';
import { ProgressBarService } from '@app/shared/components/progressbar/progressbar.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { IncomingCallApiService } from '@app/core/api/incoming-call.api';
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
  authLogin$ = this.actions
    .ofType(AuthService.AUTH_LOGIN)
    .switchMap(() => [{
      type: CallService.CALL_INIT,
      payload: {}
    }]);

  @Effect()
  authLoginSuccess$ = this.actions
    .ofType(AuthService.AUTH_LOGIN_SUCCESS)
    .flatMap(() =>
      this.authService.userParams$
        .filter(Boolean)
        .pipe(first())
    )
    .switchMap(userParams => [{
      type: CallService.PBX_LOGIN,
      payload: userParams
    }]);

  @Effect()
  login$ = this.actions
    .ofType(CallService.PBX_LOGIN)
    .map((action: UnsafeAction) => action.payload)
    .filter(userParams => userParams.usePbx)
    .flatMap(() =>
      combineLatest(
        this.callService.settings$.filter(Boolean),
        this.callService.params$.map(params => params ? params.intPhone : null)
      )
      .pipe(first())
    )
    .filter(([ settings, intPhone ]) => !settings.useIntPhone || intPhone !== null)
    .switchMap(() => {
      return this.login()
        .map(() => ({
          type: CallService.PBX_LOGIN_SUCCESS,
        }))
        .catch(error => {
          return [
            { type: CallService.PBX_LOGIN_FAILURE },
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
        .map(() => ({
          type: CallService.PBX_STATUS_CHANGE_SUCCESS,
          payload: action.payload
        }))
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
  updateParams$ = this.actions
    .ofType(CallService.PBX_PARAMS_UPDATE)
    .switchMap((action: UnsafeAction) => {
      const params = action.payload;
      return this.changeParams(params)
        .map(() => ({
          type: CallService.PBX_PARAMS_CHANGE,
          payload: action.payload
        }))
        .catch(error => {
          return [
            this.notificationService
              .updateError()
              .entity('entities.callSettings.gen.plural')
              .response(error)
              .action()
          ];
        });
    });

  @Effect()
  changeParams$ = this.actions
    .ofType(CallService.PBX_PARAMS_CHANGE)
    .flatMap(() => this.authService.userParams$.pipe(first()))
    .filter(Boolean)
    .switchMap(userParams => [{
      type: CallService.PBX_LOGIN,
      payload: userParams
    }]);

  @Effect()
  stateChangeDrop$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .map((action: UnsafeAction) => action.payload)
    .filter(Boolean)
    .withLatestFrom(this.callService.activeCall$)
    .filter(([ pbxState, call ]) => call && pbxState.lineStatus === PBXStateEnum.PBX_NOCALL)
    .map(() => ({ type: CallService.CALL_DROP_SUCCESS }));

  @Effect()
  stateChangeCall$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .map((action: UnsafeAction) => action.payload)
    .filter(state => state && state.payload)
    .withLatestFrom(this.callService.activeCall$)
    .filter(([ state, call ]) => state.lineStatus === PBXStateEnum.PBX_CALL && !call)
    .map(([ state ]) => state.payload)
    .flatMap(statePayload =>
      this.repositoryService.fetch(Person, { id: statePayload.personId })
        .map(([ person ]) => [ statePayload, person ])
    )
    .map(([ statePayload, person ]) => ({
        type: CallService.CALL_SET,
        payload: {
          phoneId: statePayload.phoneId,
          debtId: statePayload.debtId,
          personRole: statePayload.personRole,
          personId: statePayload.personId,
          phone: statePayload.phoneNumber,
          firstName: person.firstName,
          middleName: person.middleName,
          lastName: person.lastName
        }
    }));

  @Effect()
  sendContactIntermediate$ = this.actions
    .ofType(CallService.PBX_CONTACT_INTERMEDIATE)
    .switchMap((action: UnsafeAction) => {
      const { callId, code, phoneId, debtId } = action.payload;
      return this.sendContactTreeIntermediate(callId, code, phoneId, debtId)
        .map(() => ({
          type: CallService.PBX_CONTACT_INTERMEDIATE_SUCCESS,
          payload: action.payload
        }))
        .catch(error => {
          return [
            { type: CallService.PBX_CONTACT_INTERMEDIATE_FAILURE },
            this.notificationService.createError().entity('entities.calls.gen.singular').response(error).action()
          ];
        });
    });

  @Effect()
  fetchCallSettings$ = this.actions
    .ofType(CallService.CALL_SETTINGS_FETCH)
    .mergeMap(() => {
      return this.read()
        .map(settings => ({
          type: CallService.CALL_SETTINGS_CHANGE,
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
        .map(() => ({
          type: CallService.CALL_START_SUCCESS,
          payload: action.payload
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
        .map(() => ({
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
        .map(() => ({
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
        .map(() => ({
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
        .map(() => ({
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

  @Effect({ dispatch: false })
  pbxCallAction$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .filter((action: UnsafeAction) => action.payload)
    .map((action: UnsafeAction) => action.payload)
    .filter(state => state.lineStatus === PBXStateEnum.PBX_CALL)
    .filter(state => state.payload
      && state.payload.debtId
      && state.payload.phoneId
      && state.payload.callTypeCode === CallTypeEnum.OUTGOING
    )
    .map(state => this.debtApi.openDebtCard(state.payload, null, state.payload.phoneId));

  @Effect({ dispatch: false })
  pbxProcessingAction$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .filter((action: UnsafeAction) => action.payload)
    .map((action: UnsafeAction) => action.payload)
    .filter(state => state.lineStatus === PBXStateEnum.PBX_NOCALL)
    .filter(state => state.payload
      && state.payload.afterCallPeriod
      && state.payload.callTypeCode === CallTypeEnum.OUTGOING
    )
    .map(state => state.payload.afterCallPeriod)
    .distinctUntilChanged()
    .map(afterCallPeriod => this.progressBarService.dispatchAction(ProgressBarService.MESSAGE_PROGRESS, afterCallPeriod));

  @Effect({ dispatch: false })
  pbxIncomingCallAction$ = this.actions
    .ofType(CallService.PBX_STATE_CHANGE)
    .filter((action: UnsafeAction) => action.payload)
    .map((action: UnsafeAction) => action.payload)
    .filter(state => state.lineStatus === PBXStateEnum.PBX_CALL)
    .filter(state => state.payload && state.payload.callTypeCode === CallTypeEnum.INCOMING)
    .map(state => this.incomingCallApiService.openIncomingCallCard(state.payload.phoneNumber));

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private callService: CallService,
    private dataService: DataService,
    private debtApi: DebtApiService,
    private progressBarService: ProgressBarService,
    private repositoryService: RepositoryService,
    private incomingCallApiService: IncomingCallApiService,
    private notificationService: NotificationsService
  ) {}

  private read(): Observable<ICallSettings> {
    return this.dataService.read('/pbx/settings');
  }

  private login(): Observable<void> {
    return this.dataService.read('/pbx/login');
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

  private changeParams(params: IPBXParams): Observable<void> {
    return this.dataService
      .update('/pbx/users', {}, params);
  }

  private sendContactTreeIntermediate(callId: number, code: number, phoneId: number, debtId: number): Observable<void> {
    return this.dataService
      .create('/pbx/contactTreeIntermediate', {}, { callId, code, phoneId, debtId });
  }
}
