import { Action } from '@ngrx/store';

import { IAuthState } from '../auth/auth.interface';
import { ICallState } from '@app/core/calls/call.interface';
import { ICampaignsState } from '../../routes/utilities/campaigns/campaigns/campaigns.interface';
import { IConstantsState } from '../../routes/admin/constants/constants.interface';
import {
  IContractorsAndPortfoliosState
} from '../../routes/admin/contractors/contractors-and-portfolios.interface';
import { IDictionariesState } from '../../routes/admin/dictionaries/dictionaries.interface';
import { IDynamicLayoutState } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { IEntityAttributesState } from '../entity/attributes/entity-attributes.interface';
import { IGuiObjectsState } from '../gui-objects/gui-objects.interface';
import { ILookupState } from '../lookup/lookup.interface';
import { IMetadataState } from '../metadata/metadata.interface';
import { INotificationsState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../../routes/admin/roles/permissions.interface';
import { IPersistenceState } from '../persistence/persistence.interface';
import { IRepositoryState } from '../repository/repository.interface';
import { IUserAttributeTypesState } from '../user/attribute-types/user-attribute-types.interface';
import { IUserConstantsState } from '../user/constants/user-constants.interface';
import { IUserDictionariesState } from '../user/dictionaries/user-dictionaries.interface';
import { IUserPermissionsState } from '../user/permissions/user-permissions.interface';
import { IUserTemplatesState } from '../user/templates/user-templates.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';

export interface IAppState {
  readonly auth: IAuthState;
  readonly calls: ICallState;
  readonly constants: IConstantsState;
  readonly contractorsAndPortfolios: IContractorsAndPortfoliosState;
  readonly dictionaries: IDictionariesState;
  readonly entityAttributes: IEntityAttributesState;
  readonly guiObjects: IGuiObjectsState;
  readonly layout: IDynamicLayoutState;
  readonly lookup: ILookupState;
  readonly metadata: IMetadataState;
  readonly notifications: INotificationsState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
  readonly persistence: IPersistenceState;
  readonly repository: IRepositoryState;
  readonly userAttributeTypes: IUserAttributeTypesState;
  readonly userConstants: IUserConstantsState;
  readonly userDictionaries: IUserDictionariesState;
  readonly userPermissions: IUserPermissionsState;
  readonly userTemplates: IUserTemplatesState;
  readonly users: IUsersState;
  readonly campaigns: ICampaignsState;
}

export interface UnsafeAction extends Action {
  payload?: any;
}

export interface SafeAction<T> extends Action {
  payload: T;
}
