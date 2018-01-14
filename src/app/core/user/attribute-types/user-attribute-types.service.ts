import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../state/state.interface';
import { IUserAttributeType, IUserAttributeTypes, IUserAttributeTypesAction } from './user-attribute-types.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class UserAttributeTypesService {
  static USER_ATTRIBUTE_TYPES_FETCH         = 'USER_ATTRIBUTE_TYPES_FETCH';
  static USER_ATTRIBUTE_TYPES_FETCH_SUCCESS = 'USER_ATTRIBUTE_TYPES_FETCH_SUCCESS';
  static USER_ATTRIBUTE_TYPES_FETCH_FAILURE = 'USER_ATTRIBUTE_TYPES_FETCH_FAILURE';

  private url = '/lookup/entityTypes/{entityTypeId}/entitySubtypes/{entitySubtypeCode}/attributeTypes';

  constructor(private store: Store<IAppState>, private dataService: DataService) {}

  createRefreshAction(entityTypeId: number, entitySubtypeCode: number): SafeAction<IUserAttributeTypesAction> {
    return {
      type: UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH,
      payload: {
        entityTypeId,
        entitySubtypeCode,
      }
    };
  }

  refresh(entityTypeId: number, entitySubtypeCode: number): void {
    const action = this.createRefreshAction(entityTypeId, entitySubtypeCode);
    this.store.dispatch(action);
  }

  getAttributeTypes(entityTypeId: number, entitySubtypeCode: number): Observable<IUserAttributeType[]> {
    const key = `${entityTypeId}/${entitySubtypeCode}`;

    return this.attributeTypes$
      .map(slice => slice[key])
      .switchMap(values => {
        return !values
          ? this.read(entityTypeId, entitySubtypeCode)
              .do(attributeTypes => {
                this.store.dispatch({
                  type: UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_SUCCESS,
                  payload: {
                    entityTypeId,
                    entitySubtypeCode,
                    attributeTypes
                  }
                });
              })
              .switchMap(_ => {
                return this.attributeTypes$.map(slice => slice[key]);
              })
          : of(values);
      });
  }

  private get attributeTypes$(): Observable<IUserAttributeTypes> {
    return this.store.select(state => state.userAttributeTypes)
      .map(state => state.attributeTypes);
  }

  private read(entityTypeId: number, entitySubtypeCode: number): Observable<IUserAttributeType[]> {
    return this.dataService.readAll(this.url, { entityTypeId, entitySubtypeCode });
  }
}
