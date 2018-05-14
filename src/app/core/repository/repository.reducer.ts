import { mergeDeep } from 'immutable';

import { IRepositoryAction, IRepositoryState, RepositoryActionType, RepositoryStatus } from './repository.interface';

export const initialState: IRepositoryState = {};

export function repositoryReducer(state: IRepositoryState = initialState, action: IRepositoryAction): IRepositoryState {
  switch (action.type) {
    case RepositoryActionType.FETCH_SUCCESS: {
      const { entityName, data, primaryKey, serializedParams } = action.payload;
      return mergeDeep(state, {
        [entityName]: {
          data: data.reduce((acc, item) => ({ ...acc, [item[primaryKey]]: item }), {}),
          index: {
            [serializedParams]: {
              primaryKeys: data.map(item => item[primaryKey]),
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
