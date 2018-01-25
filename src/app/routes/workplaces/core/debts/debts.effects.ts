import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { IDebtsActionType, IDebtsFetchAction, IDebtsFetchForPersonAction } from './debts.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DebtsEffects {
  @Effect()
  fetchDebt$ = this.actions$
    .ofType(IDebtsActionType.FETCH)
    .pipe(
      map((action: IDebtsFetchAction) => action.payload.debtId),
      mergeMap(debtId => this.dataService.read('/debts/{debtId}', { debtId })),
      map(debt => ({
        type: IDebtsActionType.FETCH_SUCCESS,
        payload: {
          debts: {
            [debt.id]: debt,
          }
        },
      })),
      catchError(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback()),
    );

  @Effect()
  fetchDebtsForPerson$ = this.actions$
    .ofType(IDebtsActionType.FETCH_FOR_PERSON)
    .pipe(
      map((action: IDebtsFetchForPersonAction) => action.payload.personId),
      mergeMap(personId => this.dataService.readAll('/persons/{personId}/debts', { personId })),
      map(debts => ({
        type: IDebtsActionType.FETCH_SUCCESS,
        payload: {
          debts: debts.reduce((acc, debt) => ({ ...acc, [debt.id]: debt }), {}),
        },
      })),
      catchError(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback()),
    );

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}
}
