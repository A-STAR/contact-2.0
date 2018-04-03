import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { delay, filter, map, mergeMap, throttleTime } from 'rxjs/operators';
import * as moment from 'moment';

import { IAppState } from '../state/state.interface';
import { UnsafeAction } from '@app/core/state/state.interface';
import {
  IFilters,
  INotification,
  INotificationActionType,
  INotificationActionPayload,
  INotificationsState,
  NotificationTypeEnum,
  // ITaskStatusNotification,
} from './notifications.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { SettingsService } from '@app/core/settings/settings.service';
// import { WSService } from '@app/core/ws/ws.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { NotificationActionBuilder } from './notification-action-builder';

@Injectable()
export class NotificationsService implements OnDestroy {
  static NOTIFICATION_INIT:   INotificationActionType = 'NOTIFICATION_INIT';
  static NOTIFICATION_PUSH:   INotificationActionType = 'NOTIFICATION_PUSH';
  static NOTIFICATION_RESET:  INotificationActionType = 'NOTIFICATION_RESET';
  static NOTIFICATION_FILTER: INotificationActionType = 'NOTIFICATION_FILTER';
  static NOTIFICATION_DELETE: INotificationActionType = 'NOTIFICATION_DELETE';

  static STORAGE_KEY = 'state/notifications';

  private notificationsStateSubscription: Subscription;
  private taskStatusSubscription: Subscription;

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private userDictionariesService: UserDictionariesService,
    // private wsService: WSService,
  ) {
    this.notificationsStateSubscription = combineLatest(
      this.state,
      this.authService.currentUser$,
      this.actions.ofType(NotificationsService.NOTIFICATION_INIT)
    )
    .pipe(
      // NOTE: this is to prevent multiple events from writing to the storage too often
      throttleTime(500),
      filter(([ _, user ]) => !!user)
    )
    .subscribe(([ state ]) => this.settingsService.set(NotificationsService.STORAGE_KEY, state));

    // TODO(d.maltsev): remove mock
    // this.wsService.connect<ITaskStatusNotification>('/wsapi/taskStatus').listen()
    this.taskStatusSubscription = of({
      id: 1,
      taskTypeCode: 1,
      createDateTime: '2000-01-01T00:00:00',
      statusCode: 3,
    })
    .pipe(
      delay(2000),
      mergeMap(event => {
        return this.userDictionariesService
          .getDictionary(UserDictionariesService.DICTIONARY_TASK_TYPE)
          .pipe(
            map(terms => ({ terms, event }))
          );
      }),
    )
    .subscribe(({ terms, event }) => {
      const message = terms.find(t => t.code === event.taskTypeCode).name;
      const { currentLang } = this.translateService;
      const createDateTime = moment(event.createDateTime).locale(currentLang).format('L HH:mm:ss');
      switch (event.statusCode) {
        case 3:
          this.info('system.notifications.tasks.finish.success').params({ message, createDateTime }).dispatch();
          break;
        case 4:
          this.error('system.notifications.tasks.finish.error').params({ message, createDateTime }).dispatch();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationsStateSubscription.unsubscribe();
    this.taskStatusSubscription.unsubscribe();
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
