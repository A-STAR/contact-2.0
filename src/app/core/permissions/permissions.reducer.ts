import { IPermissionAction, IPermissionsState } from './permissions.interface';

import { PermissionsService } from './permissions.service';

// TODO: separate service for persisting global state?
const savedState = localStorage.getItem(PermissionsService.STORAGE_KEY);

const defaultState: IPermissionsState = {
  permissions: [],
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function permissionReducer(
  state: IPermissionsState = savedState ? JSON.parse(savedState) : defaultState,
  action: IPermissionAction
): IPermissionsState {

  switch (action.type) {
    case 'PERMISSION_FETCH':
      return {
        permissions: []
      };
    case 'PERMISSION_INVALIDATE':
      return {
        permissions: state.permissions
      };
    case 'PERMISSION_UPDATE':
      return {
        ...state,
      };
    case 'PERMISSION_DELETE':
      return {
        permissions: state.permissions
      };
    default:
      return state;
  }
};
