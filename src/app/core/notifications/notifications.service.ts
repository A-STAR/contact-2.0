import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import { IAppState } from '../state/state.interface';
import {
  IMessage,
  INotificationActionType,
  NotificationTypeEnum,
  INotificationActionPayload,
  INotificationServiceState,
  INotification,
} from './notifications.interface';

@Injectable()
export class NotificationsService {
  static STORAGE_KEY = 'state/notifications';

  private toasterMessageTypes = {
    [NotificationTypeEnum.INFO]: 'info',
    [NotificationTypeEnum.WARNING]: 'warning',
    [NotificationTypeEnum.ERROR]: 'error',
    [NotificationTypeEnum.DEBUG]: 'error',
  };

  constructor(
    private store: Store<IAppState>,
    private toasterService: ToasterService,
    private translateService: TranslateService,
  ) {}

  get state(): Observable<INotificationServiceState> {
    return this.store
      .select(state => state.notifications)
      // TODO: separate service for persisting global state?
      .do(state => localStorage.setItem(NotificationsService.STORAGE_KEY, JSON.stringify(state)));
  }

  // get notifications(): Observable<INotification[]> {
  //   return this.store.select(state => state.notifications.notifications);
  // }

  debug(message: string | IMessage, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.DEBUG, showAlert);
  }

  error(message: string | IMessage, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.ERROR, showAlert);
  }

  warning(message: string | IMessage, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.WARNING, showAlert);
  }

  info(message: string | IMessage, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.INFO, showAlert);
  }

  reset(): void {
    this.store.dispatch(this.createAction('NOTIFICATION_RESET'));
  }

  filter(type: NotificationTypeEnum, value: boolean): void {
    this.store.dispatch(this.createAction('NOTIFICATION_FILTER', {
      filter: {
        type,
        value
      }
    }));
  }

  remove(index: number): void {
    this.store.dispatch(this.createAction('NOTIFICATION_DELETE', { index }));
  }

  private push(notification: string | IMessage, type: NotificationTypeEnum, showAlert: boolean): void {
    const translate = R.ifElse(
      R.has('message'),
      ({ message, param }) => this.translateService.instant(message, param),
      message => this.translateService.instant(message)
    );
    const translatedMessage = translate(notification);

    if (showAlert) {
      // TODO(d.maltsev): refactor as a side effect?
      this.toasterService.pop(this.toasterMessageTypes[type], translatedMessage);
    }

    this.store.dispatch(this.createAction('NOTIFICATION_PUSH', {
      notification: {
        message: translatedMessage,
        type,
        created: new Date()
      }
    }));
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): Action {
    return {
      type,
      payload
    };
  }
}
