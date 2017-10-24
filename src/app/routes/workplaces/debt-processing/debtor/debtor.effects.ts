import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { DebtorService } from './debtor.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtorEffects {

  @Effect()
  fetchDebtor$ = this.actions
    .ofType(DebtorService.FETCH_SELECTED_DEBT)
    .switchMap((action: Action) => {
      return this.debtorService.fetchDebt(action.payload)
        .map(debt => ({
          type: DebtorService.CHANGE_CURRENT_DEBT,
          payload: debt
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.debtors.info.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private debtorService: DebtorService,
    private notificationsService: NotificationsService,
  ) {}

}
