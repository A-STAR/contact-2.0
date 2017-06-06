import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../permissions/permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';

export const rootReducer = {
  // TODO: rename notificationService -> notifications
  actionsLog: actionsLogReducer,
  notificationService: notificationReducer,
  organizations: organizationsReducer,
  permissionService: permissionReducer,
  users: usersReducer,
};
