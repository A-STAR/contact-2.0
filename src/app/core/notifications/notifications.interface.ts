export type INotificationType = 'ERROR' | 'WARNING' | 'INFO';

export interface INotification {
  message: string;
  type: INotificationType;
  created: Date;
}

export interface INotificationServiceState {
  filters: {
    [key in INotificationType]: boolean;
  };
  notifications: Array<INotification>;
}

export type INotificationActionType = 'NOTIFICATION_PUSH' | 'NOTIFICATION_RESET' | 'NOTIFICATION_FILTER';

export interface INotificationActionPayload {
  notification?: INotification;
  type?: INotificationType;
}

export interface INotificationAction {
  type: INotificationActionType;
  payload?: INotificationActionPayload;
}
