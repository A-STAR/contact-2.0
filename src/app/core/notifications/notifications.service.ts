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
  INotificationsState,
  NotificationTypeEnum,
} from './notifications.interface';

import { NotificationActionBuilder } from './notification-action-builder';

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
    // TODO(d.maltsev): can we optimize this?
    this.notificationsStateSubscription = this.state.subscribe(state => {
      localStorage.setItem(NotificationsService.STORAGE_KEY, JSON.stringify(state));
    });
  }

  ngOnDestroy(): void {
    this.notificationsStateSubscription.unsubscribe();
  }

  get state(): Observable<INotificationsState> {
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

  error(text: string = null): NotificationActionBuilder {
    return new NotificationActionBuilder(this.store, this.translateService, NotificationTypeEnum.ERROR, text);
  }

  warning(text: string = null): NotificationActionBuilder {
    return new NotificationActionBuilder(this.store, this.translateService, NotificationTypeEnum.WARNING, text);
  }

  info(text: string = null): NotificationActionBuilder {
    return new NotificationActionBuilder(this.store, this.translateService, NotificationTypeEnum.INFO, text);
  }

  debug(text: string = null): NotificationActionBuilder {
    return new NotificationActionBuilder(this.store, this.translateService, NotificationTypeEnum.DEBUG, text);
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

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): Action {
    return {
      type,
      payload
    };
  }
}
