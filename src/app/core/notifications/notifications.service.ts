import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import {
  INotificationActionType,
  NotificationTypeEnum,
  INotificationActionPayload,
  INotificationServiceState
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
      .select(state => state.notificationService)
      // TODO: separate service for persisting global state?
      .do(state => localStorage.setItem(NotificationsService.STORAGE_KEY, JSON.stringify(state)))
      // TODO: double check this:
      .filter(Boolean);
  }

  debug(message: string, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.DEBUG, showAlert);
  }

  error(message: string, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.ERROR, showAlert);
  }

  warning(message: string, showAlert: boolean = true): void {
    this.push(message, NotificationTypeEnum.WARNING, showAlert);
  }

  info(message: string, showAlert: boolean = true): void {
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

  private push(message: string, type: NotificationTypeEnum, showAlert: boolean): void {
    if (showAlert) {
      // TODO: refactor as side effect?
      this.toasterService.pop(this.toasterMessageTypes[type], this.translateService.instant(message));
    }

    this.store.dispatch(this.createAction('NOTIFICATION_PUSH', {
      notification: {
        message,
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
