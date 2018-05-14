import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, distinctUntilKeyChanged, filter } from 'rxjs/operators';
import { getIn } from 'immutable';

import { IAppState } from '@app/core/state/state.interface';
import { IEntityDef, IRepositoryFetchAction, RepositoryActionType } from './repository.interface';

export const REPOSITORY_ENTITY = new InjectionToken<IEntityDef>('REPOSITORY_ENTITY');

@Injectable()
export class RepositoryService {
  constructor(
    private store: Store<IAppState>,
  ) {}

  fetch(entityKey: string, params: Record<string, any>): Observable<any> {
    const serializedParams = JSON.stringify(params);
    return this.store.pipe(
      distinctUntilKeyChanged('repository'),
      select(state => {
        const entity = getIn(state, [ 'repository', entityKey ], {});
        const status = getIn(entity, [ 'index', serializedParams, 'status' ], null);
        const data = getIn(entity, [ 'data' ], {});
        if (status === null) {
          this.dispatchFetchAction(entityKey, params);
          return null;
        } else {
          const primaryKeys = getIn(entity, [ 'index', serializedParams, 'primaryKeys' ], []);
          return primaryKeys.map(primaryKey => data[primaryKey]);
        }
      }),
      filter(Boolean),
      distinctUntilChanged(),
    );
  }

  private dispatchFetchAction(entityKey: string, params: Record<string, any>): void {
    const action: IRepositoryFetchAction = {
      type: RepositoryActionType.FETCH,
      payload: { entityKey, params },
    };
    this.store.dispatch(action);
  }
}
