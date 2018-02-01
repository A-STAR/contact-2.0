import { IAppState } from './state.interface';

import * as auth from '../auth/auth.reducer';
import * as campaigns from '../../routes/utilities/campaigns/campaigns.reducer';
import * as constants from '../../routes/admin/constants/constants.reducer';
import * as contractorsAndPortfolios from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import * as currency from '@app/shared/gui-objects/widgets/currency-rates/currency-rates.reducer';
import * as debtorCard from '../app-modules/debtor-card/debtor-card.reducer';
import * as dictionaries from '../../routes/admin/dictionaries/dictionaries.reducer';
import * as entityAttributes from '../entity/attributes/entity-attributes.reducer';
import * as guiObjects from '../gui-objects/gui-objects.reducer';
import * as lookup from '../lookup/lookup.reducer';
import * as metadata from '../metadata/metadata.reducer';
import * as notifications from '../notifications/notifications.reducer';
import * as organizations from '../../routes/admin/organizations/organizations.reducer';
import * as permissions from '../../routes/admin/roles/permissions.reducer';
import * as userAttributeTypes from '../user/attribute-types/user-attribute-types.reducer';
import * as userConstants from '../user/constants/user-constants.reducer';
import * as userDictionaries from '../user/dictionaries/user-dictionaries.reducer';
import * as userPermissions from '../user/permissions/user-permissions.reducer';
import * as userTemplates from '../user/templates/user-templates.reducer';
import * as users from '../../routes/admin/users/users.reducer';

export const reducers = {
  auth: auth.reducer,
  campaigns: campaigns.reducer,
  contractorsAndPortfolios: contractorsAndPortfolios.reducer,
  constants: constants.reducer,
  currency: currency.reducer,
  debtorCard: debtorCard.reducer,
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
  campaigns: campaigns.defaultState,
  contractorsAndPortfolios: contractorsAndPortfolios.defaultState,
  constants: constants.defaultState,
  debtorCard: debtorCard.defaultState,
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
