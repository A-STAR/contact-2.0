import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { contractorsAndPortfoliosReducer } from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import { dictionariesReducer } from '../dictionaries/dictionaries.reducer';
import { debtorsReducer } from '../../routes/workplaces/debtors/debtors.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../../routes/admin/roles/permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';
import { userConstantsReducer } from '../user/constants/user-constants.reducer';
import { userDictionariesReducer } from '../user/dictionaries/user-dictionaries.reducer';
import { userLanguagesReducer } from '../user/languages/user-languages.reducer';
import { userPermissionsReducer } from '../user/permissions/user-permissions.reducer';
import { constantsReducer } from '../../routes/admin/constants/constants.reducer';
import { metadataReducer } from '../metadata/metadata.reducer';

export const rootReducer = {
  actionsLog: actionsLogReducer,
  contractorsAndPortfolios: contractorsAndPortfoliosReducer,
  debtors: debtorsReducer,
  dictionaries: dictionariesReducer,
  notifications: notificationReducer,
  organizations: organizationsReducer,
  permissions: permissionReducer,
  users: usersReducer,
  userConstants: userConstantsReducer,
  userDictionaries: userDictionariesReducer,
  userLanguages: userLanguagesReducer,
  userPermissions: userPermissionsReducer,
  metadata: metadataReducer,
  constants: constantsReducer,
};
