import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDebtorsFetchResponse } from './debtors.interface';

import { DebtorsService } from './debtors.service';
import { GridService } from '../../../shared/components/grid/grid.service';
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
        .catch(() => {
          this.notificationsService.error('debtors.messages.errors.fetch');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private notificationsService: NotificationsService,
    private gridService: GridService,
  ) {}

  private readDebtors(): Observable<IDebtorsFetchResponse> {
    // TODO(a.poterenko) STUB
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
              {
                id: 25,
                firstName: 'Mikhail',
                middleName: 'Alexandrovich',
                lastName: 'Tyrumov',
                type: 1,
                responsible: 'System administrator',
                reward: '13331.82',
                debtId: 21,
                product: 'Autoexpress',
                city: 'Moscow'
              },
              {
                id: 26,
                firstName: 'Alexander',
                middleName: 'Sergeevich',
                lastName: 'Hohlov',
                type: 1,
                responsible: 'System administrator',
                reward: '8999.82',
                debtId: 22,
                product: 'Autoexpress',
                city: 'Samara'
              },
              {
                id: 27,
                firstName: 'Sergey',
                middleName: 'Sergeevich',
                lastName: 'Vakulov',
                type: 1,
                responsible: 'System administrator',
                reward: '2800.17',
                debtId: 23,
                product: 'Autoexpress',
                city: 'Samara'
              },
              {
                id: 28,
                firstName: 'Viktor',
                middleName: 'Sergeevich',
                lastName: 'Demidiv',
                type: 1,
                responsible: 'System administrator',
                reward: '15000.00',
                debtId: 24,
                product: 'Autoexpress',
                city: 'Moscow'
              },
              {
                id: 29,
                firstName: 'Mikhail',
                middleName: 'Sergeevich',
                lastName: 'Dubrov',
                type: 1,
                responsible: 'System administrator',
                reward: '16017.00',
                debtId: 25,
                product: 'Loan for car',
                city: 'Moscow'
              },
              {
                id: 30,
                firstName: 'Mikhail',
                middleName: 'Sergeevich',
                lastName: 'Alexeev',
                type: 1,
                responsible: 'System administrator',
                reward: '1019.00',
                debtId: 26,
                product: 'Loan for car',
                city: 'Vorkuta'
              },
              {
                id: 31,
                firstName: 'Alexander',
                middleName: 'Sergeevich',
                lastName: 'Krukov',
                type: 1,
                responsible: 'System administrator',
                reward: '8056.00',
                debtId: 27,
                product: 'Loan for car',
                city: 'Vorkuta'
              },
              {
                id: 32,
                firstName: 'Alexander',
                middleName: 'Sergeevich',
                lastName: 'Evseev',
                type: 1,
                responsible: 'System administrator',
                reward: '11000.00',
                debtId: 28,
                product: 'Loan for car',
                city: 'Moscow'
              },
              {
                id: 33,
                firstName: 'Mikhail',
                middleName: 'Demidovich',
                lastName: 'Valuev',
                type: 1,
                responsible: 'System administrator',
                reward: '13000.00',
                debtId: 29,
                product: 'Loan for car',
                city: 'Moscow'
              },
              {
                id: 34,
                firstName: 'Sergey',
                middleName: 'Alexeev',
                lastName: 'Vlasovich',
                type: 1,
                responsible: 'System administrator',
                reward: '7000.00',
                debtId: 30,
                product: 'Loan for car',
                city: 'Moscow'
              }
            ]
          }
        );
      }, 1000);
    });
  }
}
