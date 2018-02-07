import { ICallState, CallStateStatusEnum } from './call.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { CallService } from './call.service';

export const defaultState: ICallState = {
  status: null,
  settings: null,
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
        status: CallStateStatusEnum.LOADED,
        settings: action.payload
      };
    case CallService.CALL_SETTINGS_FETCH_FAILURE:
      return {
        status: CallStateStatusEnum.ERROR,
        settings: null
      };
    default:
      return state;
  }
}
