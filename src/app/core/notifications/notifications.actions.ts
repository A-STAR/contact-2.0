import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';

import { IAppState } from '../state/state.interface';
import { INotificationActionType, NotificationTypeEnum, INotificationActionPayload } from './notifications.interface';

export const createNotificationAction = (type: INotificationActionType, payload?: INotificationActionPayload) => ({
  type,
  payload
});

@Injectable()
export class NotificationsActions {

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
    this.store.dispatch(createNotificationAction('NOTIFICATION_RESET'));
  }

  filter(type: NotificationTypeEnum, value: boolean): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_FILTER', {
      filter: {
        type,
        value
      }
    }));
  }

  remove(index: number): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_DELETE', { index }));
  }

  private push(message: string, type: NotificationTypeEnum, showAlert: boolean): void {
    if (showAlert) {
      // TODO: refactor as side effect?
      this.toasterService.pop(this.toasterMessageTypes[type], this.translateService.instant(message));
    }

    this.store.dispatch(createNotificationAction('NOTIFICATION_PUSH', {
      notification: {
        message,
        type,
        created: new Date()
      }
    }));
  }
}
