import { compose } from '@ngrx/core';
import { Action, combineReducers } from '@ngrx/store';

import { IAppState } from './state.interface';

import { actionsLogReducer } from '../../routes/admin/actions-log/actions-log.reducer';
import { authReducer, resetReducer } from '../auth/auth.reducer';
import { constantsReducer } from '../../routes/admin/constants/constants.reducer';
import { contractorsAndPortfoliosReducer } from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import { dictionariesReducer } from '../dictionaries/dictionaries.reducer';
import { debtReducer } from '../../routes/workplaces/debt-processing/debtor/debtor.reducer';
import { debtorsReducer } from '../../routes/workplaces/debtors/debtors.reducer';
import { entityAttributesReducer } from '../entity/attributes/entity-attributes.reducer';
import { guiObjectsReducer } from '../gui-objects/gui-objects.reducer';
import { lookupReducer } from '../lookup/lookup.reducer';
import { metadataReducer } from '../metadata/metadata.reducer';
import { notificationReducer } from '../notifications/notifications.reducer';
import { organizationsReducer } from '../../routes/admin/organizations/organizations.reducer';
import { permissionReducer } from '../../routes/admin/roles/permissions.reducer';
import { userConstantsReducer } from '../user/constants/user-constants.reducer';
import { userDictionariesReducer } from '../user/dictionaries/user-dictionaries.reducer';
import { userPermissionsReducer } from '../user/permissions/user-permissions.reducer';
import { usersReducer } from '../../routes/admin/users/users.reducer';

export const reducers = {
  actionsLog: actionsLogReducer,
  auth: authReducer,
  constants: constantsReducer,
  contractorsAndPortfolios: contractorsAndPortfoliosReducer,
  debtors: debtorsReducer,
  debt: debtReducer,
  dictionaries: dictionariesReducer,
  entityAttributes: entityAttributesReducer,
  guiObjects: guiObjectsReducer,
  lookup: lookupReducer,
  metadata: metadataReducer,
  notifications: notificationReducer,
  organizations: organizationsReducer,
  permissions: permissionReducer,
  userConstants: userConstantsReducer,
  userDictionaries: userDictionariesReducer,
  userPermissions: userPermissionsReducer,
  users: usersReducer,
};

export function rootReducer(state: IAppState, action: Action): IAppState {
  return compose(resetReducer, combineReducers)(reducers)(state, action);
};
