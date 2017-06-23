import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDebtorCardFetchResponse } from './debtor.interface';

import { DebtorService } from './debtor.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class DebtorCardEffects {

  @Effect()
  fetchDebtor$ = this.actions
    .ofType(DebtorService.DEBTOR_FETCH)
    .switchMap((action: Action) => {
      return this.readDebtor()
        .map(response => ({
          type: DebtorService.DEBTOR_FETCH_SUCCESS,
          payload: {
            debtor: response.debtor
          }
        }))
        .catch(() => {
          this.notificationsService.error('debtors.debtor.messages.errors.fetch');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private notificationsService: NotificationsService,
    private gridService: GridService,
  ) {}

  private readDebtor(): Observable<IDebtorCardFetchResponse> {
    return Observable.of({
      success: true,
      debtor: {
        id: 10023,
        firstName: 'Pavel',
        middleName: 'Sergeevich',
        lastName: 'Smirnov'
      }
    });
  }
}
