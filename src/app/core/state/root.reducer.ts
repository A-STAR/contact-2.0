import { IAppState } from './state.interface';

import * as actionsLog from '../../routes/admin/actions-log/actions-log.reducer';
import * as auth from '../auth/auth.reducer';
import * as contractorsAndPortfolios from '../../routes/admin/contractors/contractors-and-portfolios.reducer';
import * as constants from '../../routes/admin/constants/constants.reducer';
import * as debtors from '../../routes/workplaces/debtors/debtors.reducer';
import * as dictionaries from '../dictionaries/dictionaries.reducer';
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

// import { AuthService } from '../auth/auth.service';

export function reset(nextReducer: any): any {
  // return function resetReducer(state: IAppState, action: UnsafeAction): IAppState {
  //   return nextReducer(action.type === AuthService.AUTH_GLOBAL_RESET ? undefined : state, action);
  // };
  return nextReducer;
}

export const reducers = {
  actionsLog: reset(actionsLog.reducer),
  auth: auth.reducer,
  contractorsAndPortfolios: reset(contractorsAndPortfolios.reducer),
  constants: reset(constants.reducer),
  debtors: reset(debtors.reducer),
  dictionaries: reset(dictionaries.reducer),
  entityAttributes: reset(entityAttributes.reducer),
  guiObjects: reset(guiObjects.reducer),
  lookup: reset(lookup.reducer),
  metadata: reset(metadata.reducer),
  notifications: reset(notifications.reducer),
  organizations: reset(organizations.reducer),
  permissions: reset(permissions.reducer),
  users: reset(users.reducer),
  userAttributeTypes: reset(userAttributeTypes.reducer),
  userConstants: reset(userConstants.reducer),
  userDictionaries: reset(userDictionaries.reducer),
  userPermissions: reset(userPermissions.reducer),
  userTemplates: reset(userTemplates.reducer),
};

export const initialState: Partial<IAppState> = {
  actionsLog: actionsLog.defaultState,
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
