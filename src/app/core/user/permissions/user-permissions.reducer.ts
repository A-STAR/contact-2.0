import { IUserPermissionsState } from './user-permissions.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserPermissionsService } from './user-permissions.service';

export const defaultState: IUserPermissionsState = {
  permissions: null
};

export function reducer(state: IUserPermissionsState = defaultState, action: UnsafeAction): IUserPermissionsState {
  switch (action.type) {
    case UserPermissionsService.USER_PERMISSIONS_FETCH_SUCCESS:
      return {
        ...state,
        permissions: action.payload.data,
      };
    default:
      return state;
  }
}
