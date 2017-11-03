import { compose } from '@ngrx/store';
import { Action, combineReducers } from '@ngrx/store';

import { IAppState } from './state.interface';

import actionsLog from '../../routes/admin/actions-log/actions-log.reducer';
import auth, { resetReducer } from '../auth/auth.reducer';
import contractorsAndPortfolios from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import constants from '../../routes/admin/constants/constants.reducer';
import debtors from '../../routes/workplaces/debtors/debtors.reducer';
import dictionaries from '../dictionaries/dictionaries.reducer';
import entityAttributes from '../entity/attributes/entity-attributes.reducer';
import guiObjects from '../gui-objects/gui-objects.reducer';
import lookup from '../lookup/lookup.reducer';
import metadata from '../metadata/metadata.reducer';
import notifications from '../notifications/notifications.reducer';
import organizations from '../../routes/admin/organizations/organizations.reducer';
import permissions from '../../routes/admin/roles/permissions.reducer';
import users from '../../routes/admin/users/users.reducer';
import userAttributeTypes from '../user/attribute-types/user-attribute-types.reducer';
import userConstants from '../user/constants/user-constants.reducer';
import userDictionaries from '../user/dictionaries/user-dictionaries.reducer';
import userPermissions from '../user/permissions/user-permissions.reducer';
import userTemplates from '../user/templates/user-templates.reducer';

export const reducers = {
  actionsLog: actionsLog.reducer,
  auth: auth.reducer,
  contractorsAndPortfolios: contractorsAndPortfolios.reducer,
  constants: constants.reducer,
  debtors: debtors.reducer,
  dictionaries: dictionaries.reducer,
  entityAttributes: entityAttributes.reducer,
  guiObjects: guiObjects.reducer,
  lookup: lookup.reducer,
  metadata: metadata.reducer,
  notifications: notifications.reducer,
  organizations: organizations.reducer,
  permissions: permissions.reducer,
  users: users.reducer,
  userAttributeTypes: userAttributeTypes.reducer,
  userConstants: userConstants.reducer,
  userDictionaries: userDictionaries.reducer,
  userPermissions: userPermissions.reducer,
  userTemplates: userTemplates.reducer,
};

export const initialState: IAppState = {
  actionsLog: actionsLog.defaultState,
  auth: auth.defaultState,
  contractorsAndPortfolios: contractorsAndPortfolios.defaultState,
  constants: constants.defaultState,
  debtors: debtors.defaultState,
  dictionaries: dictionaries.defaultState,
  entityAttributes: entityAttributes.defaultState,
  guiObjects: guiObjects.defaultState,
  lookup: lookup.defaultState,
  metadata: metadata.defaultState,
  notifications: notifications.defaultState,
  organizations: organizations.defaultState,
  permissions: permissions.defaultState,
  userAttributeTypes: userAttributeTypes.defaultState,
  userConstants: userConstants.defaultState,
  userDictionaries: userDictionaries.defaultState,
  userPermissions: userPermissions.defaultState,
  userTemplates: userTemplates.defaultState,
  users: users.defaultState,
};

export function rootReducer(state: IAppState, action: Action): IAppState {
  return compose(resetReducer, combineReducers)(reducers)(state, action);
}
