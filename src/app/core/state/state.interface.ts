import { IEmployeesState } from '../../routes/admin/organizations/employees/employees.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations-tree/organizations.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IPermissionsState } from '../permissions/permissions.interface';

export interface IAppState {
  // TODO: rename notificationService -> notifications
  readonly permissions: IPermissionsState;
  readonly notificationService: INotificationServiceState;
  readonly employees: IEmployeesState;
  readonly organizations: IOrganizationsState;
}
