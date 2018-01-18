import { Action } from '@ngrx/store';

import { IActionsLogState } from '../../routes/admin/actions-log/actions-log.interface';
import { IAuthState } from '../auth/auth.interface';
import { ICampaignsState } from '../../routes/utilities/campaigns/campaigns.interface';
import { IConstantsState } from '../../routes/admin/constants/constants.interface';
import { IContractorsAndPortfoliosState } from '../../routes/admin/contractors/contractors-and-portfolios.interface';
import { ICurrencyState } from '@app/shared/gui-objects/widgets/currency-rates/currency-rates.interface';
import { IDebtorCardState } from '../app-modules/debtor-card/debtor-card.interface';
import { IDictionariesState } from '../../routes/admin/dictionaries/dictionaries.interface';
import { IEntityAttributesState } from '../entity/attributes/entity-attributes.interface';
import { IGuiObjectsState } from '../gui-objects/gui-objects.interface';
import { ILookupState } from '../lookup/lookup.interface';
import { IMetadataState } from '../metadata/metadata.interface';
import { INotificationsState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../../routes/admin/roles/permissions.interface';
import { IUserAttributeTypesState } from '../user/attribute-types/user-attribute-types.interface';
import { IUserConstantsState } from '../user/constants/user-constants.interface';
import { IUserDictionariesState } from '../user/dictionaries/user-dictionaries.interface';
import { IUserPermissionsState } from '../user/permissions/user-permissions.interface';
import { IUserTemplatesState } from '../user/templates/user-templates.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';

export interface IAppState {
  readonly actionsLog: IActionsLogState;
  readonly auth: IAuthState;
  readonly constants: IConstantsState;
  readonly contractorsAndPortfolios: IContractorsAndPortfoliosState;
  readonly currency: ICurrencyState;
  readonly debtorCard: IDebtorCardState;
  readonly dictionaries: IDictionariesState;
  readonly entityAttributes: IEntityAttributesState;
  readonly guiObjects: IGuiObjectsState;
  readonly lookup: ILookupState;
  readonly metadata: IMetadataState;
  readonly notifications: INotificationsState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
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
