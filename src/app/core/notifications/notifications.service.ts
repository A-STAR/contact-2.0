import { Injectable, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../state/state.interface';
import {
  IFilters,
  INotification,
  INotificationActionType,
  INotificationActionPayload,
  INotificationServiceState,
  NotificationTypeEnum,
} from './notifications.interface';

import { ResponseError } from './response-error';

@Injectable()
export class NotificationsService implements OnDestroy {
  static NOTIFICATION_PUSH:   INotificationActionType = 'NOTIFICATION_PUSH';
  static NOTIFICATION_RESET:  INotificationActionType = 'NOTIFICATION_RESET';
  static NOTIFICATION_FILTER: INotificationActionType = 'NOTIFICATION_FILTER';
  static NOTIFICATION_DELETE: INotificationActionType = 'NOTIFICATION_DELETE';

  static STORAGE_KEY = 'state/notifications';

  private notificationsStateSubscription: Subscription;

  constructor(
    private store: Store<IAppState>,
    private translateService: TranslateService,
  ) {
    this.notificationsStateSubscription = this.state.subscribe(state => {
      localStorage.setItem(NotificationsService.STORAGE_KEY, JSON.stringify(state));
    });
  }

  ngOnDestroy(): void {
    this.notificationsStateSubscription.unsubscribe();
  }

  get state(): Observable<INotificationServiceState> {
    return this.store.select(state => state.notifications);
  }

  get length(): Observable<number> {
    return this.state
      .map(state => state.notifications.length)
      .distinctUntilChanged();
  }

  get notifications(): Observable<Array<INotification>> {
    return this.state
      .map(state => state.notifications)
      .distinctUntilChanged();
  }

  get filters(): Observable<IFilters> {
    return this.state
      .map(state => state.filters)
      .distinctUntilChanged();
  }

  createDebugAction(message: string | ResponseError, params: object = {}, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.DEBUG, message, params, showAlert);
  }

  createErrorAction(message: string | ResponseError, params: object = {}, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.ERROR, message, params, showAlert);
  }

  createWarningAction(message: string | ResponseError, params: object = {}, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.WARNING, message, params, showAlert);
  }

  createInfoAction(message: string | ResponseError, params: object = {}, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.INFO, message, params, showAlert);
  }

  debug(message: string | ResponseError, params: object = {}, showAlert: boolean = true): void {
    const action = this.createDebugAction(message, params, showAlert);
    this.store.dispatch(action);
  }

  error(message: string | ResponseError, params: object = {}, showAlert: boolean = true): void {
    const action = this.createErrorAction(message, params, showAlert);
    this.store.dispatch(action);
  }

  warning(message: string | ResponseError, params: object = {}, showAlert: boolean = true): void {
    const action = this.createWarningAction(message, params, showAlert);
    this.store.dispatch(action);
  }

  info(message: string | ResponseError, params: object = {}, showAlert: boolean = true): void {
    const action = this.createInfoAction(message, params, showAlert);
    this.store.dispatch(action);
  }

  reset(): void {
    const action = this.createAction(NotificationsService.NOTIFICATION_RESET);
    this.store.dispatch(action);
  }

  filter(type: NotificationTypeEnum, value: boolean): void {
    const action = this.createAction(NotificationsService.NOTIFICATION_FILTER, {
      filter: { type, value }
    });
    this.store.dispatch(action);
  }

  remove(index: number): void {
    const action = this.createAction(NotificationsService.NOTIFICATION_DELETE, { index });
    this.store.dispatch(action);
  }

  private createPushAction(type: NotificationTypeEnum, message: string | ResponseError, params: object, showAlert: boolean = true): Action {
    return this.createAction(NotificationsService.NOTIFICATION_PUSH, {
      notification: {
        type,
        message: this.translateMessage(message, params),
        created: new Date(),
        showAlert
      }
    });
  }

  private translateMessage(message: string | ResponseError, params: object): string {
    if (message instanceof ResponseError) {
      const messages = [
        `errors.server.${message.message}`,
        `errors.default.${message.translationKey}.${message.status}`,
        `errors.default.generic.${message.status}`
      ];
      const translations = this.translateService.instant(messages);
      return (() => {
        for (const m of messages) {
          if (m !== translations[m]) {
            return translations[m];
          }
        }
      })();
    }

    return this.translateService.instant(message, params);
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): Action {
    return {
      type,
      payload
    };
  }
}
