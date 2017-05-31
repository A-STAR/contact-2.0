import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';

import { IAppState } from '../state/state.interface';
import { INotificationActionType, INotificationType, INotificationActionPayload } from './notifications.interface';

export const createNotificationAction = (type: INotificationActionType, payload?: INotificationActionPayload) => ({
  type,
  payload
});

@Injectable()
export class NotificationsActions {

  private toasterMessageTypes = {
    DEBUG: 'error',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  };

  constructor(
    private store: Store<IAppState>,
    private toasterService: ToasterService,
    private translateService: TranslateService,
  ) {}

  debug(message: string): void {
    this.push(message, 'DEBUG');
  }

  error(message: string): void {
    this.push(message, 'ERROR');
  }

  warning(message: string): void {
    this.push(message, 'WARNING');
  }

  info(message: string): void {
    this.push(message, 'INFO');
  }

  reset(): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_RESET'));
  }

  filter(type: INotificationType, value: boolean): void {
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

  private push(message: string, type: INotificationType): void {
    // TODO: refactor as side effect?
    this.toasterService.pop(this.toasterMessageTypes[type], this.translateService.instant(message));

    this.store.dispatch(createNotificationAction('NOTIFICATION_PUSH', {
      notification: {
        message,
        type,
        created: new Date()
      }
    }));
  }
}
