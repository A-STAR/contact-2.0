import { INotificationAction, INotificationsState, NotificationTypeEnum } from './notifications.interface';

export const defaultState: INotificationsState = {
  notifications: [],
  filters: {
    [NotificationTypeEnum.DEBUG]: false,
    [NotificationTypeEnum.ERROR]: true,
    [NotificationTypeEnum.WARNING]: true,
    [NotificationTypeEnum.INFO]: true
  }
};

export function reducer(state: INotificationsState = defaultState, action: INotificationAction): INotificationsState {
  switch (action.type) {
    case 'NOTIFICATION_INIT':
      return {
        ...state,
        ...action.payload
      } as INotificationsState;
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
