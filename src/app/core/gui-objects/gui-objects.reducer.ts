import { Action } from '@ngrx/store';

import { IGuiObjectsState } from './gui-objects.interface';

import { GuiObjectsService } from './gui-objects.service';

const defaultState: IGuiObjectsState = {
  data: null
};

export function guiObjectsReducer(state: IGuiObjectsState = defaultState, action: Action): IGuiObjectsState {
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
};
