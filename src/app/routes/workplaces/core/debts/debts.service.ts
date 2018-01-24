import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IDebt, IDebtsActionType, IDebtsState } from './debts.interface';

@Injectable()
export class DebtsService {
  private loading = {
    debtIds: {},
  };

  constructor(
    private store: Store<{ debts: IDebtsState }>,
  ) {}

  getDebt(debtId: number): Observable<IDebt> {
    return this.store
      .select(state => state.debts && state.debts[debtId])
      .pipe(
        tap(debt => {
          if (debt === undefined) {
            if (!this.loading[debtId]) {
              this.store.dispatch({
                type: IDebtsActionType.FETCH,
                payload: { debtId },
              });
            }
          } else {
            this.loading[debtId] = false;
          }
        }),
      );
  }
}
