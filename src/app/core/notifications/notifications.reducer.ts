import { INotificationAction, INotificationsState, NotificationTypeEnum } from './notifications.interface';

const defaultState: INotificationsState = {
  notifications: [],
  filters: {
    [NotificationTypeEnum.DEBUG]: false,
    [NotificationTypeEnum.ERROR]: true,
    [NotificationTypeEnum.WARNING]: true,
    [NotificationTypeEnum.INFO]: true
  }
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function notificationReducer(state: INotificationsState = defaultState, action: INotificationAction): INotificationsState {
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
};
