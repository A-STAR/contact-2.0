import { Action } from '@ngrx/store';

import { IMetadataState } from './metadata.interface';

import { MetadataService } from './metadata.service';

const DEFAULT_STATE: IMetadataState = {
  lists: null
};

export function metadataReducer(state: IMetadataState = DEFAULT_STATE, action: Action): IMetadataState {
  switch (action.type) {
    case MetadataService.METADATA_FETCH_SUCCESS:
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
}
