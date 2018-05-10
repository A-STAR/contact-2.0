import { setIn } from 'immutable';

import { DynamicLayoutAction, IDynamicLayoutState, IDynamicLayoutAction } from './dynamic-layout.interface';

const initialState: IDynamicLayoutState = {};

export function dynamicLayoutReducer(
  state: IDynamicLayoutState = initialState,
  action: IDynamicLayoutAction,
): IDynamicLayoutState {
  switch (action.type) {
    case DynamicLayoutAction.CHANGE_VALID: {
      const { form, key, valid, dirty } = action.payload;
      return setIn(state, [ key, 'forms', form, 'status' ], { valid, dirty });
    }
    case DynamicLayoutAction.CHANGE_VALUE: {
      const { form, key, value } = action.payload;
      return setIn(state, [ key, 'forms', form, 'value' ], value);
    }
    default:
      return state;
  }
}
