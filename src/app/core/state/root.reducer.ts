import { IAppState } from './state.interface';

import * as auth from '@app/core/auth/auth.reducer';
import * as calls from '@app/core/calls/call.reducer';
import * as campaigns from '@app/routes/utilities/campaigns/campaigns.reducer';
import * as constants from '@app/routes/admin/constants/constants.reducer';
import * as contractorsAndPortfolios from '@app/routes/admin/contractors/contractors-and-portfolios.reducer';
import * as debtorCard from '@app/core/app-modules/debtor-card/debtor-card.reducer';
import * as dictionaries from '@app/routes/admin/dictionaries/dictionaries.reducer';
import * as entityAttributes from '@app/core/entity/attributes/entity-attributes.reducer';
import * as guiObjects from '@app/core/gui-objects/gui-objects.reducer';
import * as layout from '@app/shared/components/dynamic-layout/dynamic-layout.reducer';
import * as lookup from '@app/core/lookup/lookup.reducer';
import * as metadata from '@app/core/metadata/metadata.reducer';
import * as notifications from '@app/core/notifications/notifications.reducer';
import * as organizations from '@app/routes/admin/organizations/organizations.reducer';
import * as permissions from '@app/routes/admin/roles/permissions.reducer';
import * as persistence from '@app/core/persistence/persistence.reducer';
import * as userAttributeTypes from '@app/core/user/attribute-types/user-attribute-types.reducer';
import * as userConstants from '@app/core/user/constants/user-constants.reducer';
import * as userDictionaries from '@app/core/user/dictionaries/user-dictionaries.reducer';
import * as userPermissions from '@app/core/user/permissions/user-permissions.reducer';
import * as userTemplates from '@app/core/user/templates/user-templates.reducer';
import * as users from '@app/routes/admin/users/users.reducer';

export const reducers = {
  auth: auth.reducer,
  calls: calls.reducer,
  campaigns: campaigns.reducer,
  contractorsAndPortfolios: contractorsAndPortfolios.reducer,
  constants: constants.reducer,
  debtorCard: debtorCard.reducer,
  dictionaries: dictionaries.reducer,
  entityAttributes: entityAttributes.reducer,
  guiObjects: guiObjects.reducer,
  layout: layout.reducer,
  lookup: lookup.reducer,
  metadata: metadata.reducer,
  notifications: notifications.reducer,
  organizations: organizations.reducer,
  permissions: permissions.reducer,
  persistence: persistence.reducer,
  users: users.reducer,
  userAttributeTypes: userAttributeTypes.reducer,
  userConstants: userConstants.reducer,
  userDictionaries: userDictionaries.reducer,
  userPermissions: userPermissions.reducer,
  userTemplates: userTemplates.reducer,
};

export const initialState: Partial<IAppState> = {
  calls: calls.defaultState,
  campaigns: campaigns.defaultState,
  contractorsAndPortfolios: contractorsAndPortfolios.defaultState,
  constants: constants.defaultState,
  debtorCard: debtorCard.defaultState,
  dictionaries: dictionaries.defaultState,
  entityAttributes: entityAttributes.defaultState,
  guiObjects: guiObjects.defaultState,
  layout: layout.defaultState,
  lookup: lookup.defaultState,
  metadata: metadata.defaultState,
  notifications: notifications.defaultState,
  organizations: organizations.defaultState,
  permissions: permissions.defaultState,
  persistence: persistence.defaultState,
  userAttributeTypes: userAttributeTypes.defaultState,
  userConstants: userConstants.defaultState,
  userDictionaries: userDictionaries.defaultState,
  userPermissions: userPermissions.defaultState,
  userTemplates: userTemplates.defaultState,
  users: users.defaultState,
};
