import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { throttleTime } from 'rxjs/operators/throttleTime';

import { IAppState } from '../state/state.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import {
  IFilters,
  INotification,
  INotificationActionType,
  INotificationActionPayload,
  INotificationsState,
  NotificationTypeEnum,
} from './notifications.interface';

import { PersistenceService } from '../persistence/persistence.service';

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
    private persistenceService: PersistenceService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
  ) {
    this.notificationsStateSubscription = this.state
      // NOTE: this is to prevent multiple events from writing to the storage too often
      .pipe(throttleTime(500))
      .subscribe(state => {
        this.persistenceService.set(NotificationsService.STORAGE_KEY, state);
    });
  }

  ngOnDestroy(): void {
    this.notificationsStateSubscription.unsubscribe();
  }

  get state(): Observable<INotificationsState> {
    return this.store.select(state => state.notifications);
  }

  get count(): Observable<number> {
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

  fetchError(text: string = 'errors.default.read'): NotificationActionBuilder {
    return this.error(text);
  }

  createError(text: string = 'errors.default.create'): NotificationActionBuilder {
    return this.error(text);
  }

  copyError(text: string = 'errors.default.copy'): NotificationActionBuilder {
    return this.error(text);
  }

  updateError(text: string = 'errors.default.update'): NotificationActionBuilder {
    return this.error(text);
  }

  deleteError(text: string = 'errors.default.delete'): NotificationActionBuilder {
    return this.error(text);
  }

  permissionError(text: string = 'errors.default.read.403'): NotificationActionBuilder {
    return this.error(text);
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

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): UnsafeAction {
    return {
      type,
      payload
    };
  }
}
