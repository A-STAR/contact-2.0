import { IUserAttributeTypesState, UserAttributeTypeStatusEnum } from './user-attribute-types.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { UserAttributeTypesService } from './user-attribute-types.service';

const defaultState: IUserAttributeTypesState = {
  attributeTypes: null
};

function reducer(
  state: IUserAttributeTypesState = defaultState,
  action: UnsafeAction
): IUserAttributeTypesState {
  switch (action.type) {
    case UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH: {
      const { entityTypeId, entitySubtypeCode } = action.payload;
      const key = `${entityTypeId}/${entitySubtypeCode}`;
      return {
        ...state,
        attributeTypes: {
          ...state.attributeTypes,
          [key]: {
            status: UserAttributeTypeStatusEnum.PENDING,
            attributeTypes: state.attributeTypes && state.attributeTypes[key] ? state.attributeTypes[key].attributeTypes : [],
          },
        }
      };
    }
    case UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_SUCCESS: {
      const { entityTypeId, entitySubtypeCode, attributeTypes } = action.payload;
      const key = `${entityTypeId}/${entitySubtypeCode}`;
      return {
        ...state,
        attributeTypes: {
          ...state.attributeTypes,
          [key]: {
            status: UserAttributeTypeStatusEnum.LOADED,
            attributeTypes,
          },
        }
      };
    }
    case UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_FAILURE: {
      const { entityTypeId, entitySubtypeCode } = action.payload;
      const key = `${entityTypeId}/${entitySubtypeCode}`;
      return {
        ...state,
        attributeTypes: {
          ...state.attributeTypes,
          [key]: {
            status: UserAttributeTypeStatusEnum.ERROR,
            attributeTypes: state.attributeTypes && state.attributeTypes[key] ? state.attributeTypes[key].attributeTypes : [],
          }
        }
      };
    }
    default:
      return state;
  }
}

const userAttributeTypes = {
  defaultState,
  reducer,
};

export default userAttributeTypes;
