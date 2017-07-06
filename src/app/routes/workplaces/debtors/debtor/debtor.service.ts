import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import { IAppState } from '../../../../core/state/state.interface';
import { ISelectedDebtors } from '../debtors.interface';
import { IDebtor } from './debtor.interface';

@Injectable()
export class DebtorService {
  static DEBTOR_FETCH = 'DEBTOR_FETCH';
  static DEBTOR_FETCH_SUCCESS = 'DEBTOR_FETCH_SUCCESS';
  static DEBTOR_GENERAL_INFORMATION_FETCH = 'DEBTOR_GENERAL_INFORMATION_FETCH';
  static DEBTOR_GENERAL_INFORMATION_FETCH_SUCCESS = 'DEBTOR_GENERAL_INFORMATION_FETCH_SUCCESS';
  static DEBTOR_GENERAL_INFORMATION_PHONES_FETCH = 'DEBTOR_GENERAL_INFORMATION_PHONES_FETCH';
  static DEBTOR_GENERAL_INFORMATION_PHONES_FETCH_SUCCESS = 'DEBTOR_GENERAL_INFORMATION_PHONES_FETCH_SUCCESS';

  constructor(private store: Store<IAppState>) {}

  fetch(id: number): void {
    this.fetchCommonInfo(id);
    this.fetchGeneralInformation(id);
    this.fetchGeneralInformationPhones(id);
  }

  fetchCommonInfo(id: number): void {
    this.store.dispatch(
      {
        type: DebtorService.DEBTOR_FETCH,
        payload: id
      }
    );
  }

  fetchGeneralInformation(id: number): void {
    this.store.dispatch(
      {
        type: DebtorService.DEBTOR_GENERAL_INFORMATION_FETCH,
        payload: id
      }
    );
  }

  fetchGeneralInformationPhones(id: number): void {
    this.store.dispatch(
      {
        type: DebtorService.DEBTOR_GENERAL_INFORMATION_PHONES_FETCH,
        payload: id
      }
    );
  }

  isFetched(id: number): Observable<boolean> {
    return this.selectedDebtors.map(selectedDebtors =>
          selectedDebtors[id]
          && R.prop('id', selectedDebtors[id])
          && R.prop('generalInformation', selectedDebtors[id])
          && R.prop('id', selectedDebtors[id].generalInformation)
          && R.prop('phones', selectedDebtors[id].generalInformation)
    ).filter(Boolean);
  }

  private get selectedDebtors(): Observable<ISelectedDebtors> {
    return this.store.select(state => state.debtors.selectedDebtors)
      .distinctUntilChanged();
  }

  get selectedDebtor(): Observable<IDebtor> {
    return this.store.select(state => state.debtors.selectedDebtors[state.debtors.currentDebtor])
      .distinctUntilChanged();
  }
}
