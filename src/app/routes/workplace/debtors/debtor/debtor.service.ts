import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { ISelectedDebtors } from '../debtors.interface';

@Injectable()
export class DebtorService {
  static DEBTOR_FETCH = 'DEBTOR_FETCH';
  static DEBTOR_FETCH_SUCCESS = 'DEBTOR_FETCH_SUCCESS';

  constructor(private store: Store<IAppState>) {}

  fetch(id: number): void {
    this.store.dispatch(
      {
        type: DebtorService.DEBTOR_FETCH,
        payload: id
      }
    );
  }

  isFetched(id: number): Observable<boolean> {
    return this.selectedDebtors.map(selectedDebtors => !!selectedDebtors[id]);
  }

  private get selectedDebtors(): Observable<ISelectedDebtors> {
    return this.store.select(state => state.debtors.selectedDebtors)
      .distinctUntilChanged();
  }
}
