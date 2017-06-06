import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';

export interface IAppState {
  // TODO: rename notificationService -> notifications
  readonly actionsLog: IActionsLogServiceState;
  readonly notificationService: INotificationServiceState;
  readonly organizations: IOrganizationsState;
  readonly users: IUsersState;
}
