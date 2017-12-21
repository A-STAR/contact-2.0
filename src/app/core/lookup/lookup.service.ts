import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
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

import { ValueConverterService } from '../converter/value-converter.service';

@Injectable()
export class LookupService {
  static LOOKUP_FETCH         = 'LOOKUP_FETCH';
  static LOOKUP_FETCH_SUCCESS = 'LOOKUP_FETCH_SUCCESS';
  static LOOKUP_FETCH_FAILURE = 'LOOKUP_FETCH_FAILURE';

  private _state: ILookupState;

  constructor(
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {
    this.state$.subscribe(state => this._state = state);
  }

  lookup(entity: ILookupKey): Observable<Array<any>> {
    return this.getSlice(entity);
  }

  lookupAsOptions(entity: ILookupKey): Observable<Array<IOption>> {
    const result = this.getSlice(entity);
    switch (entity) {
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

  get contractors(): Observable<Array<ILookupContractor>> {
    return this.getSlice('contractors');
  }

  get currencies(): Observable<Array<ILookupCurrency>> {
    return this.getSlice('currencies');
  }

  get languages(): Observable<Array<ILookupLanguage>> {
    return this.getSlice('languages');
  }

  get portfolios(): Observable<Array<ILookupPortfolio>> {
    return this.getSlice('portfolios');
  }

  get roles(): Observable<Array<ILookupRole>> {
    return this.getSlice('roles');
  }

  get users(): Observable<Array<ILookupUser>> {
    return this.getSlice('users');
  }

  get contractorOptions(): Observable<Array<IOption>> {
    return this.getSlice('contractors')
      .map(contractors => this.valueConverterService.valuesToOptions(contractors))
      .distinctUntilChanged();
  }

  get currencyOptions(): Observable<Array<IOption>> {
    return this.getSlice('currencies')
      .map(currencies => currencies.map(currency => ({ label: currency.code, value: currency.id })))
      .distinctUntilChanged();
  }

  get languageOptions(): Observable<Array<IOption>> {
    return this.getSlice('languages')
      .map(languages => this.valueConverterService.valuesToOptions(languages))
      .distinctUntilChanged();
  }

  get portfolioOptions(): Observable<Array<IOption>> {
    return this.getSlice('portfolios')
      .map(portfolios => this.valueConverterService.valuesToOptions(portfolios))
      .distinctUntilChanged();
  }

  get roleOptions(): Observable<Array<IOption>> {
    return this.getSlice('roles')
      .map(roles => this.valueConverterService.valuesToOptions(roles))
      .distinctUntilChanged();
  }

  get userOptions(): Observable<Array<IOption>> {
    return this.getSlice('users')
      .map(users =>
        users.map((user: any) => ({ label: `${user.lastName} ${user.firstName} ${user.middleName}`, value: user.id })))
      .distinctUntilChanged();
  }

  createRefreshAction(key: ILookupKey): UnsafeAction {
    return { type: LookupService.LOOKUP_FETCH, payload: { key } };
  }

  refresh(key: ILookupKey): void {
    const action = this.createRefreshAction(key);
    this.store.dispatch(action);
  }

  private getSlice(key: ILookupKey): Observable<Array<any>> {
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

  private get state$(): Observable<ILookupState> {
    return this.store.select(state => state.lookup)
      .filter(Boolean);
  }
}
