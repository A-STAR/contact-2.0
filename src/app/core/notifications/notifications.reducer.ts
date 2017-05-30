import { INotificationAction, INotificationServiceState } from './notifications.interface';

import { NotificationsService } from './notifications.service';

// TODO: separate service for persisting global state?
const savedState = localStorage.getItem(NotificationsService.STORAGE_KEY);

const defaultState: INotificationServiceState = {
  notifications: [],
  filters: {
    DEBUG: false,
    ERROR: true,
    WARNING: true,
    INFO: true
  }
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function notificationReducer(
  state: INotificationServiceState = savedState ? JSON.parse(savedState) : defaultState,
  action: INotificationAction
): INotificationServiceState {

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
      const notifications = state.notifications;
      const index = action.payload.index;
      return {
        ...state,
        notifications: [
          ...notifications.slice(0, index),
          ...notifications.slice(index + 1),
        ]
      };
    default:
      return state;
  }
};
