import * as R from 'ramda';
import { INotificationAction, INotificationsState, NotificationTypeEnum } from './notifications.interface';

import { NotificationsService } from './notifications.service';

// TODO(a.tymchuk): take this to a separate service for persisting global state
const savedState = localStorage.getItem(NotificationsService.STORAGE_KEY);

export const defaultState: INotificationsState = {
  notifications: [],
  filters: {
    [NotificationTypeEnum.DEBUG]: false,
    [NotificationTypeEnum.ERROR]: true,
    [NotificationTypeEnum.WARNING]: true,
    [NotificationTypeEnum.INFO]: true
  }
};

export function reducer(
  state: INotificationsState = R.tryCatch(JSON.parse, () => defaultState)(savedState || undefined),
  action: INotificationAction
): INotificationsState {
  console.log('action', action.type);
  switch (action.type) {
    case 'NOTIFICATION_PUSH':
      return {
        ...state,
        notifications: [
          action.payload.notification,
          ...state.notifications
        ]
      };
    case 'NOTIFICATION_RESET':
      return {
        ...state,
        notifications: state.notifications.filter(notification => !state.filters[notification.type])
      };
    case 'NOTIFICATION_FILTER':
      const filter = action.payload.filter;
      return {
        ...state,
        filters: {
          ...state.filters,
          [filter.type]: filter.value
        }
      };
    case 'NOTIFICATION_DELETE':
      return {
        ...state,
        notifications: state.notifications.filter((_, i) => i !== action.payload.index)
      };
    default:
      return state;
  }
}
