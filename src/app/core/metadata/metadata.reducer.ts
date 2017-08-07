import { Action } from '@ngrx/store';

import { IMetadataState, MetadataListStatusEnum } from './metadata.interface';

import { MetadataService } from './metadata.service';

const DEFAULT_STATE: IMetadataState = {
  lists: null
};

export function metadataReducer(state: IMetadataState = DEFAULT_STATE, action: Action): IMetadataState {
  switch (action.type) {
    case MetadataService.METADATA_FETCH_SUCCESS:
      const { name, data } = action.payload;
      return {
        ...state,
        [name]: {
          columns: data,
          status: MetadataListStatusEnum.LOADED
        }
      };
    case MetadataService.METADATA_FETCH_FAILURE:
      return {
        ...state,
        [name]: {
          ...state[name],
          status: MetadataListStatusEnum.ERROR
        }
      };
    default:
      return state;
  }
}
