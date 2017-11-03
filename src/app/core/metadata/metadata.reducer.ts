import { IMetadataState, MetadataListStatusEnum } from './metadata.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { MetadataService } from './metadata.service';

const defaultState: IMetadataState = {
  lists: null
};

function reducer(state: IMetadataState = defaultState, action: UnsafeAction): IMetadataState {
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

const metadata = {
  defaultState,
  reducer,
};

export default metadata;
