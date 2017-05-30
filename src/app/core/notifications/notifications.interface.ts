export type INotificationType = 'DEBUG' | 'ERROR' | 'WARNING' | 'INFO';

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

export interface IFilterActionPayload {
  type: INotificationType;
  value: boolean;
}

export interface INotificationActionPayload {
  notification?: INotification;
  filter?: IFilterActionPayload;
}

export interface INotificationAction {
  type: INotificationActionType;
  payload?: INotificationActionPayload;
}
