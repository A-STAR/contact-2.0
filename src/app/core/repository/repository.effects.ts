import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import {
  IEntityDef,
  IRepositoryFetchAction,
  IRepositoryFetchSuccessAction,
  RepositoryActionType,
} from './repository.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { REPOSITORY_ENTITY } from './repository.service';

import {
  getPrimaryKey,
  serializeKeys,
  serializeParams,
  serializeParamsKeys,
  getUrl,
  getUrlParams,
  getQueryParams,
  isSimpleUrl,
} from './repository.utils';

import { pickDifference } from '@app/core/utils';

@Injectable()
export class RepositoryEffects {

  @Effect()
  readonly fetchEntity$: Observable<IRepositoryFetchSuccessAction> = this.actions$.pipe(
    ofType(RepositoryActionType.FETCH),
    mergeMap((action: IRepositoryFetchAction) => {
      const { entityName } = action.payload;
      const entityDef = this.entityDefs.find(e => e.entityClass.name === entityName);
      return this.fetch(entityDef, action.payload.params).pipe(
        map(data => {
          return {
            type: RepositoryActionType.FETCH_SUCCESS,
            payload: {
              entityName,
              data,
              primaryKey: getPrimaryKey(entityDef.entityClass),
              serializedParams: serializeParams(action.payload.params),
            }
          } as IRepositoryFetchSuccessAction;
        }),
      );
    })
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    @Inject(REPOSITORY_ENTITY) private entityDefs: IEntityDef[],
  ) {}

  private fetch(entityDef: IEntityDef, params: Record<string, any>): Observable<any[]> {
    const entityName = entityDef.entityClass.name.toLowerCase();
    const serializedParamKeys = serializeParamsKeys(params);
    const url = entityDef.urls.find(u => {
      const urlParams = getUrlParams(u);
      const qParams = Object.keys(getQueryParams(u, params));
      return serializeKeys(urlParams.concat(qParams)) === serializedParamKeys;
    });
    if (url) {
      const queryParams = getQueryParams(url, params);
      const routeParams = !isSimpleUrl(url) ? pickDifference(queryParams, params) : params;
      return this.dataService.readAll(getUrl(url), routeParams, { params: queryParams }).pipe(
        catchError(this.notificationsService.fetchError().entity(entityName).dispatchCallback()),
      );
    }
    return empty();
  }
}
