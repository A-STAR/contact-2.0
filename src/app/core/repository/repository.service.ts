import { Injectable, InjectionToken, Type } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, distinctUntilKeyChanged, filter } from 'rxjs/operators';
import { getIn } from 'immutable';

import { IAppState } from '@app/core/state/state.interface';
import { IEntityDef, IRepositoryFetchAction, RepositoryActionType } from './repository.interface';

import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { FieldType, getOptions } from '@app/core/repository/repository.utils';

import { serializeParams } from './repository.utils';

export const REPOSITORY_ENTITY = new InjectionToken<IEntityDef>('REPOSITORY_ENTITY');

@Injectable()
export class RepositoryService {
  constructor(
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {}

  fetch<T>(entityClass: Type<T>, params: Record<string, any>): Observable<T[]> {
    const entityName = entityClass.name;
    const serializedParams = serializeParams(params);
    return this.store.pipe(
      distinctUntilKeyChanged('repository'),
      select(state => {
        const entity = getIn(state, [ 'repository', entityName ], {});
        const status = getIn(entity, [ 'index', serializedParams, 'status' ], null);
        const data = getIn(entity, [ 'data' ], {});
        if (status === null) {
          this.dispatchFetchAction(entityName, params);
          return null;
        } else {
          const primaryKeys = getIn(entity, [ 'index', serializedParams, 'primaryKeys' ], []);
          return primaryKeys.map(primaryKey => this.buildEntity(entityClass, data[primaryKey]));
        }
      }),
      filter(Boolean),
      distinctUntilChanged(),
    );
  }

  private buildEntity<T>(entityClass: Type<T>, data: any): T {
    const r = new entityClass();
    Object.keys(data).forEach(k => {
      const options = getOptions(entityClass, k);
      switch (options.type) {
        case FieldType.BOOLEAN:
          r[k] = Boolean(data[k]);
          break;
        case FieldType.DATETIME:
        case FieldType.DATE:
          r[k] = this.valueConverterService.fromISO(data[k]);
          break;
        default:
          r[k] = data[k];
          break;
      }
    });
    return r;
  }

  private dispatchFetchAction(entityName: string, params: Record<string, any>): void {
    const action: IRepositoryFetchAction = {
      type: RepositoryActionType.FETCH,
      payload: { entityName, params },
    };
    this.store.dispatch(action);
  }
}
