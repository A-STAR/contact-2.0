import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';
import { IAuthState } from '../auth/auth.interface';
import { IConstantsState } from '../../routes/admin/constants/constants.interface';
import { IContractorsAndPortfoliosState } from '../../routes/admin/contractors/contractors-and-portfolios.interface';
import { IDebtorsState } from '../../routes/workplaces/debtors/debtors.interface';
import { IDictionariesState } from '../dictionaries/dictionaries.interface';
import { IGuiObjectsState } from '../menu/menu.interface';
import { ILookupState } from '../lookup/lookup.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../../routes/admin/roles/permissions.interface';
import { IUserConstantsState } from '../user/constants/user-constants.interface';
import { IUserDictionariesState } from '../user/dictionaries/user-dictionaries.interface';
import { IUserLanguagesState } from '../user/languages/user-languages.interface';
import { IUserPermissionsState } from '../user/permissions/user-permissions.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';
import { IMetadataState } from '../metadata/metadata.interface';

export interface IAppState {
  readonly actionsLog: IActionsLogServiceState;
  readonly auth: IAuthState;
  readonly constants: IConstantsState;
  readonly contractorsAndPortfolios: IContractorsAndPortfoliosState;
  readonly dictionaries: IDictionariesState;
  readonly guiObjects: IGuiObjectsState;
  readonly lookup: ILookupState;
  // TODO(d.maltsev): rename notificationService -> notifications
  readonly notifications: INotificationServiceState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
  readonly userConstants: IUserConstantsState;
  readonly userDictionaries: IUserDictionariesState;
  readonly userLanguages: IUserLanguagesState;
  readonly userPermissions: IUserPermissionsState;
  readonly metadata: IMetadataState;
  readonly users: IUsersState;
  readonly debtors: IDebtorsState;
}
