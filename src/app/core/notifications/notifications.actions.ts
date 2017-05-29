import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../state/state.interface';
import { INotificationActionType, INotificationType, INotificationActionPayload } from './notifications.interface';

export const createNotificationAction = (type: INotificationActionType, payload?: INotificationActionPayload) => ({
  type,
  payload
});

@Injectable()
export class NotificationsActions {

  constructor(private store: Store<IAppState>) {}

  push(message: string, type: INotificationType): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_PUSH', {
      notification: {
        message,
        type,
        created: new Date()
      }
    }));
  }

  reset(): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_RESET'));
  }

  filter(type: INotificationType, state: boolean): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_FILTER', {
      [type]: state
    }));
  }
}
