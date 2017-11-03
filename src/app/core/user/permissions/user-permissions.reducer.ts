import { IUserPermissionsState } from './user-permissions.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserPermissionsService } from './user-permissions.service';

const defaultState: IUserPermissionsState = {
  permissions: null
};

function reducer(state: IUserPermissionsState = defaultState, action: UnsafeAction): IUserPermissionsState {
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

const userPermissionsReducer = {
  defaultState,
  reducer,
};

export default userPermissionsReducer;
