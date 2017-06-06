import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IPermissionsState } from '../permissions/permissions.interface';
import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';

export interface IAppState {
  // TODO: rename notificationService -> notifications
  readonly permissions: IPermissionsState;
  readonly notificationService: INotificationServiceState;
  readonly actionsLog: IActionsLogServiceState;
  readonly organizations: IOrganizationsState;
}
