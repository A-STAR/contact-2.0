import { INotificationServiceState } from '../notifications/notifications.interface';

export interface IAppState {
  readonly notificationService: INotificationServiceState;
}
