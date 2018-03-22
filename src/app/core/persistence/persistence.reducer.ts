import { IPersistenceState } from '@app/core/persistence/persistence.interface';
import { UnsafeAction } from '../state/state.interface';

import { PersistenceService } from './persistence.service';

export const defaultState: IPersistenceState = {
  data: null,
  error: null
};

export function reducer(state: IPersistenceState = defaultState, action: UnsafeAction): IPersistenceState {
  switch (action.type) {
    case PersistenceService.PERSISTENCE_SET:
    case PersistenceService.PERSISTENCE_GET:
    case PersistenceService.PERSISTENCE_DELETE:
      return {
        ...state,
        data: action.payload.data
      };
    case PersistenceService.PERSISTENCE_ERROR:
      return {
        ...state,
        data: action.payload.data,
        error: action.payload.error
      };
    default:
      return state;

  }
}
