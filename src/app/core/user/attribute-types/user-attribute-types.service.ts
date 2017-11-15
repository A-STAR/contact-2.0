import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
// import { distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '../../state/state.interface';
import {
  IUserAttributeType, IUserAttributeTypes, IUserAttributeTypesAction
} from './user-attribute-types.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class UserAttributeTypesService {
  static USER_ATTRIBUTE_TYPES_FETCH         = 'USER_ATTRIBUTE_TYPES_FETCH';
  static USER_ATTRIBUTE_TYPES_FETCH_SUCCESS = 'USER_ATTRIBUTE_TYPES_FETCH_SUCCESS';
  static USER_ATTRIBUTE_TYPES_FETCH_FAILURE = 'USER_ATTRIBUTE_TYPES_FETCH_FAILURE';

  // private attributeTypes: IUserAttributeTypes = {};
  private url = '/lookup/entityTypes/{entityTypeId}/entitySubtypes/{entitySubtypeCode}/attributeTypes';

  constructor(private store: Store<IAppState>, private dataService: DataService) {
    // this.attributeTypes$.subscribe(attributeTypes => this.attributeTypes = attributeTypes);
  }

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
    // const status = this.attributeTypes[key] && this.attributeTypes[key].status;
    // if (status !== UserAttributeTypeStatusEnum.PENDING && status !== UserAttributeTypeStatusEnum.LOADED) {
    //   this.refresh(entityTypeId, entitySubtypeCode);
    // }

    return this.attributeTypes$
      .map(state => state[key])
      .switchMap(slice => {
        return !slice
          ? this.read(entityTypeId, entitySubtypeCode)
              .do(attributeTypes => {
                // log('fetched:', entityTypeId, entitySubtypeCode, attributeTypes);
                this.store.dispatch({
                  type: UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_SUCCESS,
                  payload: {
                    entityTypeId,
                    entitySubtypeCode,
                    attributeTypes
                  }
                });
              })
          : Observable.of(slice).do(state => { console.log('slice', state); });
      });

    // .filter(slice => !!slice)
    // .map(slice => slice.attributeTypes)
    // .filter(types => types && !!types.length);

    // return this.attributeTypes$
    //   .map(state => state[key])
    //   .filter(slice => slice && slice.status === UserAttributeTypeStatusEnum.LOADED)
    //   .map(slice => slice.attributeTypes)
    //   .pipe(distinctUntilChanged());
  }

  private get attributeTypes$(): Observable<IUserAttributeTypes> {
    return this.store.select(state => state.userAttributeTypes)
      .map(state => state.attributeTypes);
  }

  private read(entityTypeId: number, entitySubtypeCode: number): Observable<IUserAttributeType[]> {
    return this.dataService.readAll(this.url, { entityTypeId, entitySubtypeCode });
  }
}
