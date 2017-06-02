import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';

export interface IAppState {
  // TODO: rename notificationService -> notifications
  readonly notificationService: INotificationServiceState;
  readonly organizations: IOrganizationsState;
}
