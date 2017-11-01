import { compose } from '@ngrx/core';
import { Action, combineReducers } from '@ngrx/store';

import { IAppState } from './state.interface';

import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { authReducer, resetReducer } from '../auth/auth.reducer';
import { contractorsAndPortfoliosReducer } from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import { dictionariesReducer } from '../dictionaries/dictionaries.reducer';
import { debtorsReducer } from '../../routes/workplaces/debtors/debtors.reducer';
import { entityAttributesReducer } from '../entity/attributes/entity-attributes.reducer';
import { guiObjectsReducer } from '../gui-objects/gui-objects.reducer';
import { lookupReducer } from '../lookup/lookup.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../../routes/admin/roles/permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';
import { userAttributeTypesReducer } from '../user/attribute-types/user-attribute-types.reducer';
import { userConstantsReducer } from '../user/constants/user-constants.reducer';
import { userDictionariesReducer } from '../user/dictionaries/user-dictionaries.reducer';
import { userPermissionsReducer } from '../user/permissions/user-permissions.reducer';
import { userTemplatesReducer } from '../user/templates/user-templates.reducer';
import { constantsReducer } from '../../routes/admin/constants/constants.reducer';
import { metadataReducer } from '../metadata/metadata.reducer';

export const reducers = {
  actionsLog: actionsLogReducer,
  auth: authReducer,
  contractorsAndPortfolios: contractorsAndPortfoliosReducer,
  constants: constantsReducer,
  debtors: debtorsReducer,
  dictionaries: dictionariesReducer,
  entityAttributes: entityAttributesReducer,
  guiObjects: guiObjectsReducer,
  lookup: lookupReducer,
  metadata: metadataReducer,
  notifications: notificationReducer,
  organizations: organizationsReducer,
  permissions: permissionReducer,
  users: usersReducer,
  userAttributeTypes: userAttributeTypesReducer,
  userConstants: userConstantsReducer,
  userDictionaries: userDictionariesReducer,
  userPermissions: userPermissionsReducer,
  userTemplates: userTemplatesReducer,
};

export function rootReducer(state: IAppState, action: Action): IAppState {
  return compose(resetReducer, combineReducers)(reducers)(state, action);
}
