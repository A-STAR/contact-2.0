import { Action } from '@ngrx/store';

import { IEntityAttributesState, EntityAttributesStatusEnum } from './entity-attributes.interface';

import { EntityAttributesService } from './entity-attributes.service';

export function entityAttributesReducer(state: IEntityAttributesState = {}, action: Action): IEntityAttributesState {
  switch (action.type) {
    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          status: EntityAttributesStatusEnum.PENDING
        }
      }
    }
    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_SUCCESS: {
      const { id, attribute } = action.payload;
      return {
        ...state,
        [id]: {
          attribute,
          status: EntityAttributesStatusEnum.LOADED
        }
      }
    }
    case EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_FAILURE: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          status: EntityAttributesStatusEnum.ERROR
        }
      }
    }
    default:
      return state;
  }
};
