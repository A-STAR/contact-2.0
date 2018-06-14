import { IGuiObjectsState } from './gui-objects.interface';
import { UnsafeAction } from '@app/core/state/state.interface';

import { GuiObjectsService } from './gui-objects.service';

export const defaultState: IGuiObjectsState = {
  data: null,
  selectedObject: { id: 0, name: 'menuItemHome', children: [] }
};

export function reducer(state: IGuiObjectsState = defaultState, action: UnsafeAction): IGuiObjectsState {
  switch (action.type) {
    case GuiObjectsService.GUI_OBJECTS_FETCH_SUCCESS:
      return {
        ...state,
        data: [
          { id: 0, name: 'menuItemHome', children: [] },
          ...action.payload
        ]
      };
    case GuiObjectsService.GUI_OBJECTS_SELECTED:
      return {
        ...state,
        selectedObject: { ...action.payload }
      };
    default:
      return state;
  }
}
