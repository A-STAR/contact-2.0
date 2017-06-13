import { IPermissionAction, IPermissionsState, IPermissionsDialogEnum } from './permissions.interface';

import { PermissionsService } from './permissions.service';

// TODO: separate service for persisting global state?
const savedState = localStorage.getItem(PermissionsService.STORAGE_KEY);

const defaultState: IPermissionsState = {
  permissions: {},
  dialog: IPermissionsDialogEnum.NONE,
  currentPermission: null,
  currentRole: null,
  rawPermissions: null,
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function permissionReducer(
  state: IPermissionsState = savedState ? JSON.parse(savedState) : defaultState,
  action: IPermissionAction
): IPermissionsState {

  switch (action.type) {
    case PermissionsService.PERMISSION_FETCH_SUCCESS:
      return {
        ...state,
        permissions: { ...action.payload },
      };

    case PermissionsService.PERMISSION_UPDATE:
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [action.payload.permission.name]: !!action.payload.permission.valueB
        },
      };

    case PermissionsService.PERMISSION_DELETE:
      const filteredKeys = Object.keys(state.permissions)
        .filter(key => key !== action.payload.name);
      const permissions = filteredKeys.reduce((acc, key) => {
        acc[key] = state.permissions[key];
        return acc;
      }, {});

      return {
        ...state,
        permissions: { ...permissions },
      };

    case PermissionsService.PERMISSION_DIALOG:
      return {
        ...state,
        ...action.payload,
      };

    case PermissionsService.PERMISSION_SELECTED_PERMISSION:
      return {
        ...state,
        currentPermission: action.payload,
      };

    default:
      return state;
  }
};

