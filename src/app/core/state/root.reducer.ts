import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { dictionariesReducer } from '../dictionaries/dictionaries.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../permissions/permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';

export const rootReducer = {
  actionsLog: actionsLogReducer,
  dictionaries: dictionariesReducer,
  // TODO: rename notificationService -> notifications
  notifications: notificationReducer,
  organizations: organizationsReducer,
  permissions: permissionReducer,
  users: usersReducer,
};
