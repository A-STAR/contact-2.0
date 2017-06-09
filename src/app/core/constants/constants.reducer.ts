import { IConstantAction, IConstantsState, IConstant } from './constants.interface';

import { ConstantsService } from './constants.service';

// TODO(a.tymchuk): separate service for persisting global state?
const savedState = localStorage.getItem(ConstantsService.STORAGE_KEY);

const defaultState: IConstantsState = {};

export function permissionReducer(
  state: IConstantsState = savedState ? JSON.parse(savedState) : defaultState,
  action: IConstantAction
): IConstantsState {

  switch (action.type) {
    case ConstantsService.CONSTANT_FETCH_SUCCESS:
      return Object.assign({}, action.payload);
    case ConstantsService.CONSTANT_UPDATE:
      return {
        ...state,
        ...action.payload as IConstant
      };
    default:
      return state;
  }
};
