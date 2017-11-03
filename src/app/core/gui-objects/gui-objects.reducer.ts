import { IGuiObjectsState } from './gui-objects.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { GuiObjectsService } from './gui-objects.service';

const defaultState: IGuiObjectsState = {
  data: null
};

function reducer(state: IGuiObjectsState = defaultState, action: UnsafeAction): IGuiObjectsState {
  switch (action.type) {
    case GuiObjectsService.GUI_OBJECTS_FETCH_SUCCESS:
      return {
        ...state,
        data: [
          { id: 0, name: 'menuItemHome', children: [] },
          ...action.payload
        ]
      };
    default:
      return state;
  }
}

const guiObjects = {
  defaultState,
  reducer,
};

export default guiObjects;
