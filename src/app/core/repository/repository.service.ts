import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { getIn } from 'immutable';

import { IAppState } from '@app/core/state/state.interface';
import { IEntityDef, IRepositoryFetchAction, RepositoryActionType } from './repository.interface';
import { distinctUntilKeyChanged } from 'rxjs/operators/distinctUntilKeyChanged';

export const REPOSITORY_ENTITY = new InjectionToken<IEntityDef>('REPOSITORY_ENTITY');

@Injectable()
export class RepositoryService {
  constructor(
    private store: Store<IAppState>,
  ) {}

  fetch(entityKey: string, params: Record<string, any>): Observable<any> {
    return this.store.pipe(
      distinctUntilKeyChanged('repository'),
      select(state => {
        const entity = getIn(state, [ 'repository', entityKey ], {});
        const serializedParams = this.serializeParams(params);
        const status = getIn(entity, [ 'index', serializedParams, 'status' ], null);
        if (status === null) {
          this.dispatchFetchAction(entityKey, params);
          return null;
        } else {
          const ids = getIn(entity, [ 'index', serializedParams, 'ids' ], []);
          const data = getIn(entity, [ 'data' ], {});
          return ids.map(id => data[id]);
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

  private serializeParams(params: Record<string, any>): string {
    return JSON.stringify(params);
  }
}
