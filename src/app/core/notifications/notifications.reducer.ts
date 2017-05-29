import { INotificationAction, INotificationServiceState, INotificationTypeEnum } from './notifications.interface';

const defaultState: INotificationServiceState = {
  notifications: []
};

export const notificationReducer = (state: INotificationServiceState = defaultState, action: INotificationAction) => {
  switch (action.type) {
    case 'NOTIFICATION_PUSH':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          action.payload
        ]
      };
    case 'NOTIFICATION_RESET':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};
