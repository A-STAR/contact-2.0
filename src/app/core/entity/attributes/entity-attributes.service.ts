import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';

import {
  EntityAttributesStatusEnum,
  IEntityAttributes,
  IEntityAttribute,
} from './entity-attributes.interface';
import { IAppState } from '@app/core/state/state.interface';

import { AbstractActionService } from '@app/core/state/action.service';

@Injectable()
export class EntityAttributesService extends AbstractActionService {
  static DICT_VALUE_1 = 198;
  static DICT_VALUE_2 = 199;
  static DICT_VALUE_3 = 200;
  static DICT_VALUE_4 = 201;

  static ENTITY_ATTRIBUTE_FETCH         = 'ENTITY_ATTRIBUTE_FETCH';
  static ENTITY_ATTRIBUTE_FETCH_SUCCESS = 'ENTITY_ATTRIBUTE_FETCH_SUCCESS';
  static ENTITY_ATTRIBUTE_FETCH_FAILURE = 'ENTITY_ATTRIBUTE_FETCH_FAILURE';

  private hash = {};
  private statuses = [EntityAttributesStatusEnum.PENDING, EntityAttributesStatusEnum.LOADED];

  readonly bag$ = this.store.pipe(
    select(state => state.entityAttributes),
  );

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
    this.getPayload<number[]>(EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_FAILURE)
      .subscribe(ids => this.setErrorLoadStatus(ids));
  }

  getDictValueAttributes(): Observable<IEntityAttributes> {
    return this.getAttributes([
      EntityAttributesService.DICT_VALUE_1,
      EntityAttributesService.DICT_VALUE_2,
      EntityAttributesService.DICT_VALUE_3,
      EntityAttributesService.DICT_VALUE_4,
    ]);
  }

  getAttribute(id: number): Observable<IEntityAttribute> {
    return this.store.pipe(
      select(state => state.entityAttributes[id]),
      tap(attribute => {
        if (attribute) {
          this.hash[id] = EntityAttributesStatusEnum.LOADED;
        } else if (this.hash[id] !== EntityAttributesStatusEnum.PENDING) {
          this.refresh([id]);
          this.hash[id] = EntityAttributesStatusEnum.PENDING;
        }
      }),
      filter(Boolean),
      distinctUntilChanged(),
    );
  }

  getAttributes(ids: number[]): Observable<IEntityAttributes> {
    const idsToFetch = ids.reduce((acc, id) => {
      const status = this.hash[id];
      return !this.statuses.includes(status)
        ? acc.concat(id)
        : acc;
    }, []);

    idsToFetch.forEach(id => {
      this.hash[id] = EntityAttributesStatusEnum.PENDING;
    });

    if (idsToFetch.length) {
      this.refresh(idsToFetch);
    }

    return this.bag$
      .map(state => ids.reduce((acc, id) => ({ ...acc, [id]: state[id] }), {}))
      .filter(slice => Object.keys(slice).reduce((acc, key) => acc && slice[key], true))
      .do(slice => Object.keys(slice).forEach(id => {
        this.hash[id] = EntityAttributesStatusEnum.LOADED;
      }));
  }

  private setErrorLoadStatus(ids: number[]): void {
    ids.forEach(id => {
      this.hash[id] = EntityAttributesStatusEnum.ERROR;
    });
  }

  private refresh(ids: number[]): void {
    const action = { type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH, payload: { ids } };
    this.store.dispatch(action);
  }
}
