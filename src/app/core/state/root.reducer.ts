import { employeesReducer } from '../../routes/admin/organizations/employees/employees.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations-tree/organizations.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';

export const rootReducer = {
  // TODO: rename notificationService -> notifications
  notificationService: notificationReducer,
  organizations: organizationsReducer,
  employees: employeesReducer
};
