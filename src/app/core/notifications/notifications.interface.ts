export enum NotificationTypeEnum {
  INFO,
  WARNING,
  ERROR,
  DEBUG,
}

export interface INotification {
  message: string;
  type: NotificationTypeEnum;
  created: Date;
  showAlert: boolean;
}

export interface IFilters {
  [key: string]: boolean;
}

export interface INotificationsState {
  filters: IFilters;
  notifications: Array<INotification>;
}

export type INotificationActionType =
  'NOTIFICATION_INIT' |
  'NOTIFICATION_PUSH' |
  'NOTIFICATION_RESET' |
  'NOTIFICATION_FILTER' |
  'NOTIFICATION_DELETE';

export interface IFilterActionPayload {
  type: NotificationTypeEnum;
  value: boolean;
}

export interface INotificationActionPayload {
  notification?: INotification;
  filter?: IFilterActionPayload;
  index?: number;
}

export interface INotificationAction {
  type: INotificationActionType;
  payload?: INotificationActionPayload;
}

export interface IMessageParams {
  [key: string]: string;
}

export interface IMessageOptions {
  prefix?: string;
  response?: any;
  // text and params act as fallback options in case there no response is passed
  text?: string;
  params?: IMessageParams;
  alert?: boolean;
}

export interface ITaskStatusNotification {
  id: number;
  taskTypeCode: number;
  createDateTime: string;
  statusCode: number;
}
