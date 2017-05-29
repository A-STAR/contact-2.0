import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../state/state.interface';
import { INotification, INotificationActionType, INotificationTypeEnum } from './notifications.interface';

export const createNotificationAction = (type: INotificationActionType, payload?: INotification) => ({
  type,
  payload
});

@Injectable()
export class NotificationActions {

  constructor(private store: Store<IAppState>) {}

  push(message: string, type: INotificationTypeEnum): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_PUSH', {
      message,
      type,
      created: new Date()
    }));
  }

  reset(): void {
    this.store.dispatch(createNotificationAction('NOTIFICATION_RESET'));
  }
}
