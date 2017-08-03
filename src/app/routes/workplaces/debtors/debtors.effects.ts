import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDebtorsFetchResponse } from './debtors.interface';

import { DebtorsService } from './debtors.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class DebtorsEffects {

  @Effect()
  fetchDebtor$ = this.actions
    .ofType(DebtorsService.DEBTORS_FETCH)
    .switchMap((action: Action) => {
      return this.readDebtors()
        .map(response => ({
          type: DebtorsService.DEBTORS_FETCH_SUCCESS,
          payload: response.debtors
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.debtors.info.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private notificationsService: NotificationsService,
  ) {}

  private readDebtors(): Observable<IDebtorsFetchResponse> {
    // TODO(a.tymchuk) STUB
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          {
            success: true,
            debtors: [
              {
                id: 23,
                firstName: 'Pavel',
                middleName: 'Sergeevich',
                lastName: 'Smirnov',
                type: 1,
                responsible: 'System administrator',
                reward: '3180.78',
                debtId: 19,
                product: 'Autoexpress',
                city: 'London'
              },
              {
                id: 24,
                firstName: 'Alexey',
                middleName: 'Pavlovich',
                lastName: 'Mironov',
                type: 1,
                responsible: 'System administrator',
                reward: '4994.11',
                debtId: 20,
                product: 'Autoexpress',
                city: 'London'
              },
            ]
          }
        );
      }, 1000);
    });
  }
}
