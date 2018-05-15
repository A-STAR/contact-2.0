import { Injectable, InjectionToken, Type } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { getIn } from 'immutable';
import { equals } from 'ramda';

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
      distinctUntilChanged((a, b) => equals(a.repository[entityName], b.repository[entityName])),
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

  refresh<T>(entityClass: Type<T>, params: Record<string, any>): void {
    const entityName = entityClass.name;
    this.dispatchFetchAction(entityName, params);
  }

  private buildEntity<T>(entityClass: Type<T>, data: any): T {
    const entity = new entityClass();
    const options = getOptions(entityClass);
    Object.keys(options).forEach(key => {
      switch (options[key].type) {
        case FieldType.BOOLEAN:
          entity[key] = Boolean(data[key]);
          break;
        case FieldType.DATETIME:
        case FieldType.DATE:
          entity[key] = this.valueConverterService.fromISO(data[key]);
          break;
        default:
          entity[key] = data[key];
          break;
      }
    });
    return entity;
  }

  private dispatchFetchAction(entityName: string, params: Record<string, any>): void {
    const action: IRepositoryFetchAction = {
      type: RepositoryActionType.FETCH,
      payload: { entityName, params },
    };
    this.store.dispatch(action);
  }
}
