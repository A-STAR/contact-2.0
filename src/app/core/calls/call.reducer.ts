import { ICallState } from './call.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { CallService } from './call.service';

export const defaultState: ICallState = {
  pbxState: null,
  settings: null,
  activeCall: null
};

export function reducer(state: ICallState = defaultState, action: UnsafeAction): ICallState {
  switch (action.type) {
    case CallService.CALL_INIT:
      return {
        ...state,
        ...action.payload
      };
    case CallService.CALL_SETTINGS_FETCH_SUCCESS:
      return {
        ...state,
        settings: action.payload
      };
    case CallService.CALL_SETTINGS_FETCH_FAILURE:
      return {
        ...state,
        settings: null
      };
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
    case CallService.CALL_DROP: {
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
    case CallService.PBX_STATE_CHANGE: {
      return {
        ...state,
        pbxState: action.payload
      };
    }
    default:
      return state;
  }
}
