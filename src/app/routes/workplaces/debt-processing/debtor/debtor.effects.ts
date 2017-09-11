import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDebt } from '../debt-processing.interface';

import { DataService } from '../../../../core/data/data.service';
import { DebtorService } from './debtor.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class DebtorEffects {

  @Effect()
  fetchDebtor$ = this.actions
    .ofType(DebtorService.FETCH_SELECTED_DEBT)
    .switchMap((action: Action) => {
      return this.fetchDebt(action.payload)
        .map(debt => ({
          type: DebtorService.CHANGE_CURRENT_DEBT,
          payload: debt
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.debtors.info.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService.read('/debts/{debtId}', { debtId })
    .map(response => response.debts[0])
    .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.singular').dispatchCallback());
  }
}
