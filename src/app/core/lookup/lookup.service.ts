import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../state/state.interface';
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

  get contractors(): Observable<Array<ILookupContractor>> {
    return this.getSlice('contractors').distinctUntilChanged();
  }

  get currencies(): Observable<Array<ILookupCurrency>> {
    return this.getSlice('currencies').distinctUntilChanged();
  }

  get languages(): Observable<Array<ILookupLanguage>> {
    return this.getSlice('languages').distinctUntilChanged();
  }

  get portfolios(): Observable<Array<ILookupPortfolio>> {
    return this.getSlice('portfolios').distinctUntilChanged();
  }

  get roles(): Observable<Array<ILookupRole>> {
    return this.getSlice('roles').distinctUntilChanged();
  }

  get users(): Observable<Array<ILookupUser>> {
    return this.getSlice('users').distinctUntilChanged();
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
      .map(users => users.map((user: any) => ({ label: `${user.lastName} ${user.firstName} ${user.middleName}`, value: user.id })))
      .distinctUntilChanged();
  }

  createRefreshAction(key: ILookupKey): Action {
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
    return this.store.select(state => state.lookup);
  }
}
