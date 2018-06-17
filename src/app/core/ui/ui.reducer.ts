import { mergeDeep } from 'immutable';

import { IUIState, IUIAction, UIActionType } from './ui.interface';

export const defaultState = {};

export function reducer(state: IUIState, action: IUIAction): IUIState {
  switch (action.type) {
    case UIActionType.UPDATE: {
      const { key, state: s } = action.payload;
      return mergeDeep(state, { [key]: s });
    }
    default:
      return state;
  }
}
