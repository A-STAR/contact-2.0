import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { dictionariesReducer } from '../dictionaries/dictionaries.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../../routes/admin/roles/permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';
import { userConstantsReducer } from '../user/constants/user-constants.reducer';
import { userLanguagesReducer } from '../user/languages/user-languages.reducer';
import { userPermissionsReducer } from '../user/permissions/user-permissions.reducer';
import { constantsReducer } from '../constants/constants.reducer';

export const rootReducer = {
  actionsLog: actionsLogReducer,
  dictionaries: dictionariesReducer,
  notifications: notificationReducer,
  organizations: organizationsReducer,
  permissions: permissionReducer,
  users: usersReducer,
  userConstants: userConstantsReducer,
  userLanguages: userLanguagesReducer,
  userPermissions: userPermissionsReducer,
  constants: constantsReducer,
};
