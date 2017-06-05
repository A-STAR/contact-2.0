import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { permissionReducer } from '../permissions/permissions.reducer';
import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';

export const rootReducer = {
  // TODO: rename notificationService -> notifications
  notificationService: notificationReducer,
  organizations: organizationsReducer,
  permissionService: permissionReducer,
  actionsLogService: actionsLogReducer,
};
