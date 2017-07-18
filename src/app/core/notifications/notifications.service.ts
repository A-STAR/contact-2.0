import { Injectable, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../state/state.interface';
import {
  IFilters,
  IMessageOptions,
  INotification,
  INotificationActionType,
  INotificationActionPayload,
  INotificationServiceState,
  NotificationTypeEnum,
} from './notifications.interface';

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

  createDebugAction(message: string | IMessageOptions): Action {
    return this.createPushAction(NotificationTypeEnum.DEBUG, message);
  }

  createErrorAction(message: string | IMessageOptions): Action {
    return this.createPushAction(NotificationTypeEnum.ERROR, message);
  }

  createWarningAction(message: string | IMessageOptions): Action {
    return this.createPushAction(NotificationTypeEnum.WARNING, message);
  }

  createInfoAction(message: string | IMessageOptions): Action {
    return this.createPushAction(NotificationTypeEnum.INFO, message);
  }

  debug(message: string | IMessageOptions): void {
    const action = this.createDebugAction(message);
    this.store.dispatch(action);
  }

  error(message: string | IMessageOptions): void {
    const action = this.createErrorAction(message);
    this.store.dispatch(action);
  }

  warning(message: string | IMessageOptions): void {
    const action = this.createWarningAction(message);
    this.store.dispatch(action);
  }

  info(message: string | IMessageOptions): void {
    const action = this.createInfoAction(message);
    this.store.dispatch(action);
  }

  createResponseErrorAction(text: string, params: any = {}): (error: Response) => Array<Action> {
    return (response: Response) => [
      this.createErrorAction({ text, params, response })
    ];
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

  private createPushAction(type: NotificationTypeEnum, message: string | IMessageOptions): Action {
    return this.createAction(NotificationsService.NOTIFICATION_PUSH, {
      notification: {
        type,
        message: this.translateMessage(message),
        created: new Date(),
        showAlert: (message as IMessageOptions).alert !== false
      }
    });
  }

  private translateMessage(message: string | IMessageOptions): string {
    if (message instanceof String) {
      return this.translateService.instant(message);
    }

    const translatedParams = Object.keys(message.params || {}).reduce((acc, key) => {
      acc[key] = this.translateService.instant(message.params[key]);
      return acc;
    }, {});

    if (message.response) {
      const { status } = message.response;
      const { code, payload } = message.response.json().message;

      // TODO(d.maltsev): interpolate payload properly (maybe convert to object?)
      const translatedMessageKey = `errors.server.${code}`;
      const translatedMessage = this.translateService.instant(translatedMessageKey, payload);
      if (translatedMessage !== translatedMessageKey) {
        return translatedMessage;
      }

      const translatedFallbackMessageKey = `${message.text}.${status}`;
      const translatedFallbackMessage = this.translateService.instant(translatedFallbackMessageKey, translatedParams);
      if (translatedFallbackMessage !== translatedFallbackMessageKey) {
        return translatedFallbackMessage;
      }

      return this.translateService.instant(`${message.text}.*`, translatedParams);
    }

    return this.translateService.instant(message.text, translatedParams);
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): Action {
    return {
      type,
      payload
    };
  }
}
