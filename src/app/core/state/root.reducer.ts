import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';

export const rootReducer = {
  // TODO: rename notificationService -> notifications
  notificationService: notificationReducer,
  organizations: organizationsReducer
};
