import { notificationReducer } from '../notifications/notifications.reducer';
import { permissionReducer } from '../permissions/permissions.reducer';

export const rootReducer = {
  notificationService: notificationReducer,
  permissionService: permissionReducer,
};
