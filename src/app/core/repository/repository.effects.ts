import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';

import {
  IEntityDef,
  IRepositoryFetchAction,
  IRepositoryFetchSuccessAction,
  RepositoryActionType,
} from './repository.interface';

import { DataService } from '@app/core/data/data.service';

import { REPOSITORY_ENTITY } from '@app/core/repository/repository.service';

@Injectable()
export class RepositoryEffects {

  @Effect()
  readonly fetchEntity$: Observable<IRepositoryFetchSuccessAction> = this.actions$.pipe(
    ofType(RepositoryActionType.FETCH),
    mergeMap((action: IRepositoryFetchAction) => {
      return this.fetch(action.payload.entityKey, action.payload.params).pipe(
        map(data => {
          return {
            type: RepositoryActionType.FETCH_SUCCESS,
            payload: {
              entityKey: action.payload.entityKey,
              data,
              serializedParams: JSON.stringify(action.payload.params),
            }
          } as IRepositoryFetchSuccessAction;
        }),
      );
    })
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    @Inject(REPOSITORY_ENTITY) private entityDefs: IEntityDef[],
  ) {}

  private fetch(entity: string, params: Record<string, any>): Observable<any[]> {
    const entityDef = this.entityDefs.find(e => e.entityKey === entity);
    const serializedParamKeys = this.serializeKeys(Object.keys(params));
    const url = entityDef.urls.find(u => {
      const urlParams = u.match(/\{.+?\}/gi).map(i => i.slice(1, -1));
      return this.serializeKeys(urlParams) === serializedParamKeys;
    });
    return this.dataService.readAll(url, params);
  }

  private serializeKeys(keys: string[]): string {
    return keys.sort().join(',');
  }
}
