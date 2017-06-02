import { employeesReducer } from '../../routes/admin/organizations/employees/employees.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations-tree/organizations.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { permissionReducer } from '../permissions/permissions.reducer';

export const rootReducer = {
  // TODO: rename notificationService -> notifications
  employees: employeesReducer,
  notificationService: notificationReducer,
  organizations: organizationsReducer,
  permissionService: permissionReducer,
};
