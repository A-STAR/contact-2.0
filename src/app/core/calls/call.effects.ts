import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ICallSettings, ICall } from './call.interface';
import { UnsafeAction } from '@app/core/state/state.interface';

import { CallService } from './call.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CallEffects {

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
    .mergeMap((action: UnsafeAction) => {
      const { phoneId, debtId, personId, personRole } = action.payload;
      return this.call(phoneId, debtId, personId, personRole)
        .map(call => ({
          type: CallService.CALL_START_SUCCESS,
          payload: call
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
    .mergeMap((action: UnsafeAction) => {
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
    .mergeMap((action: UnsafeAction) => {
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
    .mergeMap((action: UnsafeAction) => {
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
    .mergeMap((action: UnsafeAction) => {
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

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {}

  private read(): Observable<ICallSettings> {
    // return this.dataService.read('pbx/settings');
    return of({
      useIntPhone: 1,
      usePreview: 1,
      previewShowRegContact: 1,
      useMakeCall: 1,
      useDropCall: 1,
      useHoldCall: 1,
      useRetriveCall: 1,
      useTransferCall: 1
    });
  }

  private call(phoneId: number, debtId: number, personId: number, personRole: number): Observable<ICall> {
    // return this.dataService
      // .create('pbx/call/make', { }, { phoneId, debtId, personId, personRole });
    return of({
      id: 1,
      phoneId,
      debtId,
      personId,
      personRole
    });
  }

  private drop(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('pbx/call/drop', {}, { debtId, personId, personRole });
  }

  private hold(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('pbx/call/hold', {}, { debtId, personId, personRole });
  }

  private retrieve(debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('pbx/call/retrive', {}, { debtId, personId, personRole });
  }

  private transfer(userId: number, debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create('pbx/call/transfer', {}, { userId, debtId, personId, personRole });
  }
}
