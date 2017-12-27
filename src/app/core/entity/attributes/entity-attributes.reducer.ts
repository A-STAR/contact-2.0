import { UnsafeAction } from '../../../core/state/state.interface';

import { IEntityAttributesState } from './entity-attributes.interface';

import { EntityAttributesService } from './entity-attributes.service';

export const defaultState = {};

export function reducer(state: IEntityAttributesState = defaultState, action: UnsafeAction): IEntityAttributesState {
  switch (action.type) {

    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_SUCCESS: {
      const attributes = action.payload.reduce((acc, attribute) => {
        acc[attribute.id] = attribute;
        return acc;
      }, {});

      return {
        ...state,
        ...attributes,
      };
    }

    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH:
    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_FAILURE:
    default:
      return state;
  }
}
