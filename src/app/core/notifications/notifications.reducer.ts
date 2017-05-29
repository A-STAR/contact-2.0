import { INotificationAction, INotificationServiceState } from './notifications.interface';

const defaultState: INotificationServiceState = {
  notifications: [],
  filters: {
    ERROR: true,
    WARNING: true,
    INFO: true
  }
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function notificationReducer(
  state: INotificationServiceState = defaultState,
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
        notifications: []
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
    default:
      return state;
  }
};
