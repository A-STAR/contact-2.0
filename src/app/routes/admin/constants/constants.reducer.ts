import { IConstantAction, IConstantsState, IConstant } from './constants.interface';

import { ConstantsService } from './constants.service';

export const defaultState: IConstantsState = {
  currentConstant: null,
};

export function reducer(state: IConstantsState = defaultState, action: IConstantAction): IConstantsState {

  switch (action.type) {
    case ConstantsService.CONSTANT_INIT:
      return {
        ...state,
        ...action.payload
      };
    case ConstantsService.CONSTANT_SELECT:
      return {
        ...state,
        currentConstant: action.payload as IConstant
      };
    default:
      return state;
  }
}
