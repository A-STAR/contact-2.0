import * as R from 'ramda';

import { IConstantAction, IConstantsState, IConstant } from './constants.interface';

import { ConstantsService } from './constants.service';

const savedState = localStorage.getItem(ConstantsService.STORAGE_KEY);

const defaultState: IConstantsState = {
  constants: [],
  currentConstant: null,
};

export function constantsReducer(
  state: IConstantsState = R.tryCatch(JSON.parse, () => defaultState)(savedState || undefined),
  action: IConstantAction
): IConstantsState {

  switch (action.type) {
    case ConstantsService.CONSTANT_FETCH_SUCCESS:
      return {
        ...state,
        constants: action.payload
      };
    case ConstantsService.CONSTANT_SELECT:
      return {
        ...state,
        currentConstant: action.payload as IConstant
      };
    case ConstantsService.CONSTANT_CLEAR:
      return {
        ...state,
        constants: [],
        currentConstant: null
      };
    default:
      return state;
  }
};
