import * as R from 'ramda';

import { IConstantAction, IConstantsState, IConstant } from './constants.interface';

import { ConstantsService } from './constants.service';

const savedState = localStorage.getItem(ConstantsService.STORAGE_KEY);

export const defaultState: IConstantsState = {
  currentConstant: null,
};

export function reducer(
  state: IConstantsState = R.tryCatch(JSON.parse, () => defaultState)(savedState || undefined),
  action: IConstantAction
): IConstantsState {

  switch (action.type) {
    case ConstantsService.CONSTANT_SELECT:
      return {
        ...state,
        currentConstant: action.payload as IConstant
      };
    default:
      return state;
  }
}
