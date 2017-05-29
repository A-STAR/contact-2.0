export enum INotificationTypeEnum {
  ERROR,
  DANGER,
  WARNING,
  NOTICE,
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
