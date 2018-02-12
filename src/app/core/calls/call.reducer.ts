import { ICallState } from './call.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { CallService } from './call.service';

export const defaultState: ICallState = {
  settings: null,
  calls: []
};

export function reducer(state: ICallState = defaultState, action: UnsafeAction): ICallState {
  switch (action.type) {
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
        calls: [
          ...state.calls,
          { ...action.payload }
        ]
      };
    case CallService.CALL_START_SUCCESS: {
      const { id, phoneId } = action.payload;
      return {
        ...state,
        calls: state.calls.map(call => call.phoneId === phoneId
          ? { ...call, id }
          : call
        )
      };
    }
    case CallService.CALL_START_FAILURE: {
      const { phoneId } = action.payload;
      return {
        ...state,
        calls: state.calls.filter(call => call.phoneId !== phoneId)
      };
    }
    case CallService.CALL_DROP: {
      const { id } = action.payload;
      return {
        ...state,
        calls: state.calls.filter(call => call.id !== id)
      };
    }
    case CallService.CALL_HOLD_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        calls: state.calls.map(call => call.id === id
          ? { ...call, onHold: true }
          : call
        )
      };
    }
    case CallService.CALL_HOLD_FAILURE: {
      const { id } = action.payload;
      return {
        ...state,
        calls: state.calls.map(call => call.id === id
          ? { ...call, onHold: false }
          : call
        )
      };
    }
    case CallService.CALL_RETRIEVE_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        calls: state.calls.map(call => call.id === id
          ? { ...call, onHold: false }
          : call
        )
      };
    }
    case CallService.CALL_TRANSFER_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        calls: state.calls.filter(call => call.id !== id)
      };
    }
    default:
      return state;
  }
}
