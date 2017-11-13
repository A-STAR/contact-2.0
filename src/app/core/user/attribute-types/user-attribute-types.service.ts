import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../state/state.interface';
import { IUserAttributeType, IUserAttributeTypes, UserAttributeTypeStatusEnum } from './user-attribute-types.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

@Injectable()
export class UserAttributeTypesService {
  static USER_ATTRIBUTE_TYPES_FETCH         = 'USER_ATTRIBUTE_TYPES_FETCH';
  static USER_ATTRIBUTE_TYPES_FETCH_SUCCESS = 'USER_ATTRIBUTE_TYPES_FETCH_SUCCESS';
  static USER_ATTRIBUTE_TYPES_FETCH_FAILURE = 'USER_ATTRIBUTE_TYPES_FETCH_FAILURE';

  private attributeTypes: IUserAttributeTypes;

  constructor(private store: Store<IAppState>) {
    this.attributeTypes$.subscribe(attributeTypes => this.attributeTypes = attributeTypes);
  }

  createRefreshAction(entityTypeId: number, entitySubtypeCode: number): UnsafeAction {
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
    const status = this.attributeTypes && this.attributeTypes[key] && this.attributeTypes[key].status;
    if (status !== UserAttributeTypeStatusEnum.PENDING && status !== UserAttributeTypeStatusEnum.LOADED) {
      this.refresh(entityTypeId, entitySubtypeCode);
    }
    return this.attributeTypes$
      .map(state => state[key])
      .filter(slice => slice && slice.status === UserAttributeTypeStatusEnum.LOADED)
      .map(slice => slice.attributeTypes)
      .distinctUntilChanged();
  }

  private get attributeTypes$(): Observable<IUserAttributeTypes> {
    return this.store.select(state => state.userAttributeTypes)
      .filter(Boolean)
      .map(state => state.attributeTypes);
  }
}
