import { Injectable, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as R from 'ramda';

import { IAppState } from '../state/state.interface';
import {
  IFilters,
  IMessage,
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

  createDebugAction(message: string | IMessage, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.DEBUG, message, showAlert);
  }

  createErrorAction(message: string | IMessage, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.ERROR, message, showAlert);
  }

  createWarningAction(message: string | IMessage, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.WARNING, message, showAlert);
  }

  createInfoAction(message: string | IMessage, showAlert: boolean = true): Action {
    return this.createPushAction(NotificationTypeEnum.INFO, message, showAlert);
  }

  debug(message: string | IMessage, showAlert: boolean = true): void {
    const action = this.createDebugAction(message, showAlert);
    this.store.dispatch(action);
  }

  error(message: string | IMessage, showAlert: boolean = true): void {
    const action = this.createErrorAction(message, showAlert);
    this.store.dispatch(action);
  }

  warning(message: string | IMessage, showAlert: boolean = true): void {
    const action = this.createWarningAction(message, showAlert);
    this.store.dispatch(action);
  }

  info(message: string | IMessage, showAlert: boolean = true): void {
    const action = this.createInfoAction(message, showAlert);
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

  private createPushAction(type: NotificationTypeEnum, message: string | IMessage, showAlert: boolean = true): Action {
    const translate = R.ifElse(
      R.has('message'),
      ({ message: text, param }) => this.translateService.instant(text, param),
      text => this.translateService.instant(text)
    );
    const translatedMessage = translate(message);

    return this.createAction(NotificationsService.NOTIFICATION_PUSH, {
      notification: {
        type,
        message: translatedMessage,
        created: new Date(),
        showAlert
      }
    });
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): Action {
    return {
      type,
      payload
    };
  }
}
