export enum INotificationTypeEnum {
  ERROR,
  WARNING,
  INFO,
}

export interface INotification {
  message: string;
  type: INotificationTypeEnum;
  created: Date;
}

export interface INotificationServiceState {
  notifications: Array<INotification>;
}

export type INotificationActionType = 'NOTIFICATION_PUSH' | 'NOTIFICATION_RESET';

export interface INotificationAction {
  type: INotificationActionType;
  payload?: INotification;
}
