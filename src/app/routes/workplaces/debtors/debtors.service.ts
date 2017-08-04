import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IPerson } from '../debt-processing/debtor/debtor.interface';

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

  selectDebtor(debtor: IPerson): void {
    this.store.dispatch({
      type: DebtorsService.DEBTOR_SELECT,
      payload: debtor
    });
  }

  showDebtor(id: number): void {
    this.router.navigate([`/workplaces/debts/${id}`]);
  }

  get selectedDebtor(): Observable<IPerson> {
    return this.store.select(state => state.debtors.selectedDebtor)
      .distinctUntilChanged();
  }

  get debtors(): Observable<IPerson[]> {
    return this.store.select(state => state.debtors.debtors)
      .distinctUntilChanged();
  }
}
