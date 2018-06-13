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
    default:
      return state;
  }
}
