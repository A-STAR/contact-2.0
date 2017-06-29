import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IDebtor } from './debtor/debtor.interface';

@Injectable()
export class DebtorsService {
  static DEBTORS_FETCH = 'DEBTORS_FETCH';
  static DEBTORS_FETCH_SUCCESS = 'DEBTORS_FETCH_SUCCESS';
  static DEBTOR_SELECT = 'DEBTOR_SELECT';

  constructor(
    private store: Store<IAppState>,
    private router: Router
  ) {
  }

  fetchDebtors(): void {
    this.store.dispatch({
      type: DebtorsService.DEBTORS_FETCH
    });
  }

  isFetched(): Observable<boolean> {
    return this.debtors.filter(Boolean);
  }

  selectDebtor(debtor: IDebtor): void {
    this.store.dispatch({
      type: DebtorsService.DEBTOR_SELECT,
      payload: debtor
    });
  }

  showDebtor(id: number): void {
    this.router.navigate([`/workplaces/debt-list/${id}`]);
  }

  get selectedDebtor(): Observable<IDebtor> {
    return this.store.select(state => state.debtors.selectedDebtor)
      .distinctUntilChanged();
  }

  get debtors(): Observable<IDebtor[]> {
    return this.store.select(state => state.debtors.debtors)
      .distinctUntilChanged();
  }
}
