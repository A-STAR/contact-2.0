import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';
import { IDictionariesState } from '../dictionaries/dictionaries.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../permissions/permissions.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';

export interface IAppState {
  readonly actionsLog: IActionsLogServiceState;
  readonly dictionaries: IDictionariesState;
  // TODO(d.maltsev): rename notificationService -> notifications
  readonly notificationService: INotificationServiceState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
  readonly users: IUsersState;
}
