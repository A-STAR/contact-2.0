import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { EntityAttributesStatusEnum, IEntityAttributes, IEntityAttributesState } from './entity-attributes.interface';
import { IAppState } from '../../state/state.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

@Injectable()
export class EntityAttributesService {
  static DICT_VALUE_1 = 198;
  static DICT_VALUE_2 = 199;
  static DICT_VALUE_3 = 200;
  static DICT_VALUE_4 = 201;

  static ENTITY_ATTRIBUTE_FETCH         = 'ENTITY_ATTRIBUTE_FETCH';
  static ENTITY_ATTRIBUTE_FETCH_SUCCESS = 'ENTITY_ATTRIBUTE_FETCH_SUCCESS';
  static ENTITY_ATTRIBUTE_FETCH_FAILURE = 'ENTITY_ATTRIBUTE_FETCH_FAILURE';

  private _state: IEntityAttributesState;

  constructor(private store: Store<IAppState>) {
    this.state$.subscribe(state => this._state = state);
  }

  getDictValueAttributes(): Observable<IEntityAttributes> {
    return this.getAttributes([
      EntityAttributesService.DICT_VALUE_1,
      EntityAttributesService.DICT_VALUE_2,
      EntityAttributesService.DICT_VALUE_3,
      EntityAttributesService.DICT_VALUE_4,
    ]);
  }

  getAttributes(ids: Array<number>): Observable<IEntityAttributes> {
    ids.forEach(id => {
      const status = this._state[id] && this._state[id].status;
      if (status !== EntityAttributesStatusEnum.PENDING && status !== EntityAttributesStatusEnum.LOADED) {
        this.refresh(id);
      }
    });

    return this.state$
      .map(state => ids.reduce((acc, id) => ({ ...acc, [id]: state[id] }), {}))
      .filter(slice =>
        Object.keys(slice).reduce((acc, key) => acc && slice[key].status === EntityAttributesStatusEnum.LOADED, true))
      .map(slice => Object.keys(slice).reduce((acc, key) => ({ ...acc, [key]: slice[key].attribute }), {}));
  }

  createRefreshAction(id: number): UnsafeAction {
    return { type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH, payload: { id } };
  }

  refresh(id: number): void {
    const action = this.createRefreshAction(id);
    this.store.dispatch(action);
  }

  private get state$(): Observable<IEntityAttributesState> {
    return this.store.select(state => state.entityAttributes)
      .filter(Boolean);
  }
}
