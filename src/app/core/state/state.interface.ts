import { IActionsLogServiceState } from '../../routes/admin/actions-log/actions-log.interface';
import { IConstantsState } from '../../routes/admin/constants/constants.interface';
import { IDebtorsState } from '../../routes/workplaces/debtors/debtors.interface';
import { IDictionariesState } from '../dictionaries/dictionaries.interface';
import { INotificationServiceState } from '../notifications/notifications.interface';
import { IOrganizationsState } from '../../routes/admin/organizations/organizations.interface';
import { IPermissionsState } from '../../routes/admin/roles/permissions.interface';
import { IUserConstantsState } from '../user/constants/user-constants.interface';
import { IUserDictionariesState } from '../user/dictionaries/user-dictionaries.interface';
import { IUserLanguagesState } from '../user/languages/user-languages.interface';
import { IUserPermissionsState } from '../user/permissions/user-permissions.interface';
import { IUsersState } from '../../routes/admin/users/users.interface';

export interface IAppState {
  readonly actionsLog: IActionsLogServiceState;
  readonly constants: IConstantsState;
  readonly dictionaries: IDictionariesState;
  // TODO(d.maltsev): rename notificationService -> notifications
  readonly notifications: INotificationServiceState;
  readonly organizations: IOrganizationsState;
  readonly permissions: IPermissionsState;
  readonly userConstants: IUserConstantsState;
  readonly userDictionaries: IUserDictionariesState;
  readonly userLanguages: IUserLanguagesState;
  readonly userPermissions: IUserPermissionsState;
  readonly users: IUsersState;
  readonly debtors: IDebtorsState;
}
