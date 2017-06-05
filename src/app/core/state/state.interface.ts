import { IEmployeesState } from '../../routes/admin/organizations/employees/employees.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations-tree/organizations.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';

export interface IAppState {
  // TODO: rename notificationService -> notifications
  readonly notificationService: INotificationServiceState;
  readonly actionsLog: IActionsLogServiceState;
  readonly employees: IEmployeesState;
  readonly organizations: IOrganizationsState;
}
