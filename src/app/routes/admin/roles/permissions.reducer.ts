import { IPermissionAction, IPermissionsState } from './permissions.interface';
import { PermissionsService } from './permissions.service';

export const defaultState: IPermissionsState = {
  currentPermission: null,
  currentRole: null,
  permissions: null,
  roles: []
};

export function reducer(state: IPermissionsState = defaultState, action: IPermissionAction): IPermissionsState {
  switch (action.type) {
    case PermissionsService.ROLE_INIT:
      return {
        ...state,
        ...action.payload
      };
    case PermissionsService.ROLE_FETCH_SUCCESS:
      const cr = state.currentRole;
      const isThere = cr && action.payload.some(role => cr.id === role.id);
      return {
        ...state,
        roles: action.payload,
        currentRole: isThere ? cr : null,
        // currentPermission: null
      };

    case PermissionsService.ROLE_SELECTED:
      return {
        ...state,
        currentRole: action.payload.role
      };

    case PermissionsService.ROLE_CLEAR:
      return {
        ...state,
        roles: [],
        currentRole: null,
        permissions: [],
        currentPermission: null
      };

    case PermissionsService.PERMISSION_FETCH_SUCCESS:
      return {
        ...state,
        permissions: action.payload.permissions,
      };

    case PermissionsService.PERMISSION_CLEAR:
      return {
        ...state,
        permissions: [],
        currentPermission: null
      };

    /*
     ** Intentionally left for communication via sockets
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
    */

    case PermissionsService.PERMISSION_SELECTED:
      return {
        ...state,
        currentPermission: action.payload,
      };

    default:
      return state;
  }
}
