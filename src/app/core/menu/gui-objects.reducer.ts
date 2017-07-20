import { Action } from '@ngrx/store';

import { IGuiObjectsState } from './menu.interface';

import { MenuService } from './menu.service';

const defaultState: IGuiObjectsState = {
  guiObjects: [],
  isResolved: null
};

export function guiObjectsReducer(state: IGuiObjectsState = defaultState, action: Action): IGuiObjectsState {
  switch (action.type) {
    case MenuService.GUI_OBJECTS_FETCH_SUCCESS:
      return {
        ...state,
        guiObjects: [
          { id: 0, name: 'menuItemHome', children: [] },
          ...action.payload.appGuiObjects
        ],
        isResolved: true
      };
    case MenuService.GUI_OBJECTS_FETCH_FAILURE:
      return {
        ...state,
        guiObjects: [],
        isResolved: false
      };
    default:
      return state;
  }
};
