import { ICallState } from './call.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { CallService } from './call.service';

export const defaultState: ICallState = {
  pbxConnected: null,
  pbxState: null,
  settings: null,
  params: null,
  activeCall: null
};

export function reducer(state: ICallState = defaultState, action: UnsafeAction): ICallState {
  switch (action.type) {
    case CallService.CALL_INIT:
      return {
        ...action.payload
      };
    case CallService.CALL_SETTINGS_CHANGE:
      return {
        ...state,
        settings: action.payload
      };
    case CallService.CALL_SETTINGS_FETCH_FAILURE:
      return {
        ...state,
        settings: null
      };
    case CallService.CALL_SET: {
      return {
        ...state,
        activeCall: action.payload
      };
    }
    case CallService.CALL_START:
      return {
        ...state,
        activeCall: action.payload
      };
    case CallService.CALL_START_FAILURE: {
      return {
        ...state,
        activeCall: null
      };
    }
    case CallService.CALL_DROP_SUCCESS: {
      return {
        ...state,
        activeCall: null
      };
    }
    case CallService.CALL_TRANSFER_SUCCESS: {
      return {
        ...state,
        activeCall: null
      };
    }
    case CallService.PBX_LOGIN_SUCCESS: {
      return {
        ...state,
        pbxConnected: true
      };
    }
    case CallService.PBX_LOGIN_FAILURE: {
      return {
        ...state,
        pbxConnected: false
      };
    }
    case CallService.PBX_STATE_CHANGE: {
      return {
        ...state,
        pbxState: {
          ...state.pbxState,
          ...action.payload
        }
      };
    }
    case CallService.PBX_PARAMS_CHANGE: {
      return {
        ...state,
        params: action.payload
      };
    }
    default:
      return state;
  }
}
