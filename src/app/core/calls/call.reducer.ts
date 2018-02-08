import { ICallState, CallStateStatusEnum } from './call.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { CallService } from './call.service';

export const defaultState: ICallState = {
  status: null,
  settings: null,
  call: null
};

export function reducer(state: ICallState = defaultState, action: UnsafeAction): ICallState {
  switch (action.type) {
    case CallService.CALL_SETTINGS_FETCH:
      return {
        ...state,
        status: CallStateStatusEnum.PENDING,
      };
    case CallService.CALL_SETTINGS_FETCH_SUCCESS:
      return {
        ...state,
        status: CallStateStatusEnum.LOADED,
        settings: action.payload
      };
    case CallService.CALL_SETTINGS_FETCH_FAILURE:
      return {
        ...state,
        status: CallStateStatusEnum.ERROR,
        settings: null
      };
    case CallService.CALL_START_SUCCESS:
      return {
        ...state,
        call: action.payload
      };
    case CallService.CALL_START_FAILURE:
      return {
        ...state,
        call: null
      };
    case CallService.CALL_DROP:
      return {
        ...state,
        call: null
      };
    case CallService.CALL_HOLD_SUCCESS:
      return {
        ...state,
        call: { ...(state.call || {}), onHold: true }
      };
    case CallService.CALL_HOLD_FAILURE:
      return {
        ...state,
        call: { ...(state.call || {}), onHold: false }
      };
    case CallService.CALL_RETRIEVE_SUCCESS:
      return {
        ...state,
        call: { ...(state.call || {}), onHold: false }
      };
    case CallService.CALL_TRANSFER_SUCCESS:
      return {
        ...state,
        call: null
      };
    default:
      return state;
  }
}
