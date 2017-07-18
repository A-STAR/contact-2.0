import { Response } from '@angular/http';

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

export interface INotificationServiceState {
  filters: IFilters;
  notifications: Array<INotification>;
}

export type INotificationActionType = 'NOTIFICATION_PUSH' | 'NOTIFICATION_RESET' | 'NOTIFICATION_FILTER' | 'NOTIFICATION_DELETE';

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

export interface IMessageOptions {
  prefix?: string;
  response?: Response;
  // text and params act as fallback options in case there no response is passed
  text?: string;
  params?: {
    [key: string]: string;
  };
  alert?: boolean;
}
