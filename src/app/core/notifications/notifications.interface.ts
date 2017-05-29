export type INotificationType = 'ERROR' | 'WARNING' | 'INFO';

export interface INotification {
  message: string;
  type: INotificationType;
  created: Date;
}

export type INotificationFilters = {
  [key in INotificationType]: boolean;
};

export interface INotificationServiceState {
  filters: INotificationFilters;
  notifications: Array<INotification>;
}

export type INotificationActionType = 'NOTIFICATION_PUSH' | 'NOTIFICATION_RESET' | 'NOTIFICATION_FILTER';

export interface INotificationActionPayload {
  notification?: INotification;
  filter?: INotificationFilters;
}

export interface INotificationAction {
  type: INotificationActionType;
  payload?: INotificationActionPayload;
}
