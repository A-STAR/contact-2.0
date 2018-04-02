import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { valuesToOptions, toOption } from '../utils';

import {
  ILookupState,
  ILookupContractor,
  ILookupCurrency,
  ILookupLanguage,
  ILookupPortfolio,
  ILookupRole,
  ILookupUser,
  ILookupKey,
  LookupStatusEnum
} from './lookup.interface';
import { IOption } from '../converter/value-converter.interface';

@Injectable()
export class LookupService {
  static LOOKUP_FETCH         = 'LOOKUP_FETCH';
  static LOOKUP_FETCH_SUCCESS = 'LOOKUP_FETCH_SUCCESS';
  static LOOKUP_FETCH_FAILURE = 'LOOKUP_FETCH_FAILURE';

  private _state: ILookupState;

  private readonly state$ = this.store.pipe(
    select(state => state.lookup)
  );

  constructor(
    private store: Store<IAppState>,
  ) {
    this.state$.subscribe(state => this._state = state);
  }

  lookup<T>(key: ILookupKey): Observable<Array<T>> {
    return this.getSlice<T>(key);
  }

  lookupAsOptions(key: ILookupKey): Observable<Array<IOption>> {
    const result = this.getSlice(key);
    switch (key) {
      case 'currencies':
        return result.map(currencies => currencies.map(toOption('id', 'code')));
      case 'dictionaries':
        return result.map(dictionaries => dictionaries.map(toOption('code', 'name')));
      case 'users':
        return result.map(users => users.map((user: any) =>
          ({ label: `${user.lastName} ${user.firstName} ${user.middleName}`, value: user.id })));
      default:
        return result.map(valuesToOptions);
    }
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get contractors(): Observable<Array<ILookupContractor>> {
    return this.getSlice('contractors');
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get currencies(): Observable<Array<ILookupCurrency>> {
    return this.getSlice('currencies');
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get languages(): Observable<Array<ILookupLanguage>> {
    return this.getSlice('languages');
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get portfolios(): Observable<Array<ILookupPortfolio>> {
    return this.getSlice('portfolios');
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get roles(): Observable<Array<ILookupRole>> {
    return this.getSlice('roles');
  }

  /**
   * @deprecated
   * Please use this.lookup<T>(lookupKey);
   */
  get users(): Observable<Array<ILookupUser>> {
    return this.getSlice('users');
  }

  /**
   * @deprecated
   * Please use this.lookupAsOptions(lookupKey);
   */
  get currencyOptions(): Observable<Array<IOption>> {
    return this.getSlice('currencies')
      .map(currencies => currencies.map(currency => ({ label: currency.code, value: currency.id })))
      .distinctUntilChanged();
  }

  private refresh(key: ILookupKey): void {
    const action: UnsafeAction = { type: LookupService.LOOKUP_FETCH, payload: { key } };
    this.store.dispatch(action);
  }

  private getSlice<T>(key: ILookupKey): Observable<Array<T|any>> {
    const status = this._state[key] && this._state[key].status;
    if (status !== LookupStatusEnum.PENDING && status !== LookupStatusEnum.LOADED) {
      this.refresh(key);
    }
    return this.state$
      .map(state => state[key])
      .filter(slice => slice && slice.status === LookupStatusEnum.LOADED)
      .map(slice => slice.data)
      .distinctUntilChanged();
  }
}
