import { IAppState } from './state.interface';

import * as actionsLog from '../../routes/admin/actions-log/actions-log.reducer';
import * as auth from '../auth/auth.reducer';
import * as contractorsAndPortfolios from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import * as constants from '../../routes/admin/constants/constants.reducer';
import * as debtors from '../../routes/workplaces/debtors/debtors.reducer';
import * as dictionaries from '../../routes/admin/dictionaries/dictionaries.reducer';
import * as entityAttributes from '../entity/attributes/entity-attributes.reducer';
import * as guiObjects from '../gui-objects/gui-objects.reducer';
import * as lookup from '../lookup/lookup.reducer';
import * as metadata from '../metadata/metadata.reducer';
import * as notifications from '../notifications/notifications.reducer';
import * as organizations from '../../routes/admin/organizations/organizations.reducer';
import * as permissions from '../../routes/admin/roles/permissions.reducer';
import * as users from '../../routes/admin/users/users.reducer';
import * as userAttributeTypes from '../user/attribute-types/user-attribute-types.reducer';
import * as userConstants from '../user/constants/user-constants.reducer';
import * as userDictionaries from '../user/dictionaries/user-dictionaries.reducer';
import * as userPermissions from '../user/permissions/user-permissions.reducer';
import * as userTemplates from '../user/templates/user-templates.reducer';
import * as campaigns from '../../routes/utilities/campaigns/campaigns.reducer';

export const reducers = {
  actionsLog: actionsLog.reducer,
  auth: auth.reducer,
  campaigns: campaigns.reducer,
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

export const initialState: Partial<IAppState> = {
  actionsLog: actionsLog.defaultState,
  campaigns: campaigns.defaultState,
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
