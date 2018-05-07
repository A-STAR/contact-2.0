import { setIn } from 'immutable';

import { DynamicLayoutFormAction, IDynamicLayoutFormState, IDynamicLayoutFormAction } from './control.interface';

const initialState: IDynamicLayoutFormState = {};

export function formReducer(
  state: IDynamicLayoutFormState = initialState,
  action: IDynamicLayoutFormAction,
): IDynamicLayoutFormState {
  switch (action.type) {
    case DynamicLayoutFormAction.CHANGE_VALID: {
      const { form, key, valid, dirty } = action.payload;
      return setIn(state, [ key, form, 'status' ], { valid, dirty });
    }
    case DynamicLayoutFormAction.CHANGE_VALUE: {
      const { form, key, value } = action.payload;
      return setIn(state, [ key, form, 'value' ], value);
    }
    default:
      return state;
  }
}
