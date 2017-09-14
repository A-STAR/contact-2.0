import { IActionsLogState } from '../../routes/admin/actions-log/actions-log.interface';
import { IAuthState } from '../auth/auth.interface';
import { IConstantsState } from '../../routes/admin/constants/constants.interface';
import { IContractorsAndPortfoliosState } from '../../routes/admin/contractors/contractors-and-portfolios.interface';
import { IDebtorsState } from '../../routes/workplaces/debtors/debtors.interface';
import { IDebtState } from '../../routes/workplaces/debt-processing/debtor/debtor.interface';
import { IDictionariesState } from '../dictionaries/dictionaries.interface';
import { IEntityAttributesState } from '../entity/attributes/entity-attributes.interface';
import { IGuiObjectsState } from '../gui-objects/gui-objects.interface';
import { ILookupState } from '../lookup/lookup.interface';
import { INotificationsState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../../routes/admin/roles/permissions.interface';
import { IUserConstantsState } from '../user/constants/user-constants.interface';
import { IUserDictionariesState } from '../user/dictionaries/user-dictionaries.interface';
import { IUserPermissionsState } from '../user/permissions/user-permissions.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';
import { IMetadataState } from '../metadata/metadata.interface';

export interface IAppState {
  readonly actionsLog: IActionsLogState;
  readonly auth: IAuthState;
  readonly constants: IConstantsState;
  readonly contractorsAndPortfolios: IContractorsAndPortfoliosState;
  readonly debt: IDebtState;
  readonly debtors: IDebtorsState;
  readonly dictionaries: IDictionariesState;
  readonly entityAttributes: IEntityAttributesState;
  readonly guiObjects: IGuiObjectsState;
  readonly lookup: ILookupState;
  readonly metadata: IMetadataState;
  readonly notifications: INotificationsState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
  readonly userConstants: IUserConstantsState;
  readonly userDictionaries: IUserDictionariesState;
  readonly userPermissions: IUserPermissionsState;
  readonly users: IUsersState;
}
