import { IPermissionAction, IPermissionsState, IPermission } from './permissions.interface';

import { PermissionsService } from './permissions.service';

// TODO: separate service for persisting global state?
const savedState = localStorage.getItem(PermissionsService.STORAGE_KEY);

const defaultState: IPermissionsState = {};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function permissionReducer(
  state: IPermissionsState = savedState ? JSON.parse(savedState) : defaultState,
  action: IPermissionAction
): IPermissionsState {

  switch (action.type) {
    case PermissionsService.PERMISSION_FETCH_SUCCESS:
      return Object.assign({}, action.payload);
    case PermissionsService.PERMISSION_UPDATE:
      return {
        ...state,
        ...action.payload
      };
    case PermissionsService.PERMISSION_DELETE:
      const newState = Object.assign({}, state);
      delete newState.permissions[action.payload];
      return {
        ...newState
      };
    default:
      return state;
  }
};

