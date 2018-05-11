import { mergeDeep } from 'immutable';

import { IRepositoryAction, IRepositoryState, RepositoryActionType, RepositoryStatus } from './repository.interface';

export const initialState: IRepositoryState = {};

export function repositoryReducer(state: IRepositoryState = initialState, action: IRepositoryAction): IRepositoryState {
  switch (action.type) {
    case RepositoryActionType.FETCH_SUCCESS: {
      const { entityKey, data, serializedParams } = action.payload;
      return mergeDeep(state, {
        [entityKey]: {
          data: data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
          index: {
            [serializedParams]: {
              ids: data.map(item => item.id),
              status: RepositoryStatus.SUCCESS,
            },
          },
        },
      });
    }
    default:
      return state;
  }
}
