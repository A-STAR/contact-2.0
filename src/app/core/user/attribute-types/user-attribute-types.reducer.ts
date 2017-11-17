import { IUserAttributeTypesState } from './user-attribute-types.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserAttributeTypesService } from './user-attribute-types.service';

export const defaultState: IUserAttributeTypesState = {
  attributeTypes: {}
};

export function reducer(
  state: IUserAttributeTypesState = defaultState,
  action: UnsafeAction
): IUserAttributeTypesState {
  switch (action.type) {

    case UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_SUCCESS: {
      const { entityTypeId, entitySubtypeCode, attributeTypes } = action.payload;
      const key = `${entityTypeId}/${entitySubtypeCode}`;
      console.log('state', state);
      console.log('attribute types', attributeTypes);
      return {
        attributeTypes: {
          ...state.attributeTypes,
          [key]: attributeTypes
        }
      };
    }

    default:
      return state;
  }
}
