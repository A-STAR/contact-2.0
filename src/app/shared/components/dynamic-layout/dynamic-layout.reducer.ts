import { mergeDeep, setIn } from 'immutable';

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
    case DynamicLayoutAction.CHANGE_FORM_STATUS: {
      const { form, key, status } = action.payload;
      return setIn(state, [ key, 'forms', form, 'status' ], status);
    }
    case DynamicLayoutAction.CHANGE_FORM_VALUE: {
      const { form, key, value, dirty } = action.payload;
      return mergeDeep(state, {
        [key]: {
          forms: {
            [form]: {
              value,
              dirty,
            }
          }
        }
      });
    }
    default:
      return state;
  }
}
