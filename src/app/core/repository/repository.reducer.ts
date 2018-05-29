import { mergeDeep, setIn } from 'immutable';

import { IRepositoryAction, IRepositoryState, RepositoryActionType, RepositoryStatus } from './repository.interface';

export const defaultState: IRepositoryState = {};

export function reducer(state: IRepositoryState = defaultState, action: IRepositoryAction): IRepositoryState {
  switch (action.type) {
    case RepositoryActionType.FETCH: {
      const { entityName, serializedParams } = action.payload;
      return mergeDeep(state, {
        [entityName]: {
          index: {
            [serializedParams]: {
              status: RepositoryStatus.PENDING,
            },
          },
        },
      });
    }
    case RepositoryActionType.FETCH_SUCCESS: {
      const { entityName, data, primaryKey, serializedParams } = action.payload;
      const s = mergeDeep(state, {
        [entityName]: {
          data: data.reduce((acc, item) => ({ ...acc, [item[primaryKey]]: item }), {}),
          index: {
            [serializedParams]: {
              status: RepositoryStatus.SUCCESS,
            },
          },
        },
      });
      // NOTE: (d.maltsev, i.lobanov): because merge deep merges all properties including arrays,
      // so multiply items with the same id are created in primaryKeys
      return setIn(s, [ entityName, 'index', serializedParams, 'primaryKeys' ], data.map(item => item[primaryKey]));
    }
    default:
      return state;
  }
}
