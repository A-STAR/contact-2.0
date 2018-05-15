import { setIn } from 'immutable';

import { DynamicLayoutAction, IDynamicLayoutState, IDynamicLayoutAction } from './dynamic-layout.interface';

export const defaultState: IDynamicLayoutState = { };

export function reducer(
  state: IDynamicLayoutState = defaultState,
  action: IDynamicLayoutAction,
): IDynamicLayoutState {
  switch (action.type) {
    case DynamicLayoutAction.FETCH_CONFIG_SUCCESS: {
      const { key, config } = action.payload;
      return setIn(state, [ key, 'config' ], config);
    }
    case DynamicLayoutAction.CHANGE_FORM_VALID: {
      const { form, key, valid, dirty } = action.payload;
      return setIn(state, [ key, 'forms', form, 'status' ], { valid, dirty });
    }
    case DynamicLayoutAction.CHANGE_FORM_VALUE: {
      const { form, key, value } = action.payload;
      return setIn(state, [ key, 'forms', form, 'value' ], value);
    }
    default:
      return state;
  }
}
