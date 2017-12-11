import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import {
  IActionType,
  IDebtorCardAction,
  IFetchDebtsAction,
  IFetchDebtsSuccessAction,
  IFetchPersonAction,
  IFetchPersonSuccessAction,
  IInitByDebtIdAction,
  IInitByPersonIdAction,
  ISelectDebtAction,
} from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class DebtorCardEffects {
  @Effect()
  initByDebtId$ = this.actions
    .ofType(IActionType.INIT_BY_DEBT_ID)
    .mergeMap((action: IInitByDebtIdAction) => {
      const { debtId } = action.payload;
      return this.fetchDebt(debtId)
        .mergeMap(debt => [
          this.createFetchPersonAction(debt.personId),
          this.createFetchDebtsAction(debt.personId, debt.id),
        ]);
    });

  @Effect()
  initByPersonId$ = this.actions
    .ofType(IActionType.INIT_BY_PERSON_ID)
    .mergeMap((action: IInitByPersonIdAction) => {
      const { personId } = action.payload;
      return [
        this.createFetchPersonAction(personId),
        this.createFetchDebtsAction(personId),
      ];
    });

  @Effect()
  fetchPerson$ = this.actions
    .ofType(IActionType.FETCH_PERSON)
    .mergeMap((action: IFetchPersonAction) => {
      return this.fetchPerson(action.payload.personId)
        .map(person => this.createFetchPersonSuccessAction(person))
        .catch(this.notificationService.fetchError().entity('entities.person.gen.plural').callback());
    });

  @Effect()
  fetchDebts$ = this.actions
    .ofType(IActionType.FETCH_DEBTS)
    .mergeMap((action: IFetchDebtsAction) => {
      const { personId, selectedDebtId } = action.payload;
      return this.fetchDebts(personId)
        .mergeMap(debts => [
          this.createFetchDebtsSuccessAction(debts),
          this.createSelectDebtAction(selectedDebtId || (debts && debts[0].id)),
        ])
        .catch(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private createFetchDebtsAction(personId: number, selectedDebtId: number = null): IFetchDebtsAction {
    return {
      type: IActionType.FETCH_DEBTS,
      payload: { personId, selectedDebtId },
    };
  }

  private createFetchPersonAction(personId: number): IFetchPersonAction {
    return {
      type: IActionType.FETCH_PERSON,
      payload: { personId },
    };
  }

  private createSelectDebtAction(debtId: number): ISelectDebtAction {
    return {
      type: IActionType.SELECT_DEBT,
      payload: { debtId },
    };
  }

  private createFetchDebtsSuccessAction(debts: IDebt[]): IFetchDebtsSuccessAction {
    return {
      type: IActionType.FETCH_DEBTS_SUCCESS,
      payload: { debts },
    };
  }

  private createFetchPersonSuccessAction(person: IPerson): IFetchPersonSuccessAction {
    return {
      type: IActionType.FETCH_PERSON_SUCCESS,
      payload: { person },
    };
  }

  private fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService.read('/debts/{debtId}', { debtId });
  }

  private fetchPerson(personId: number): Observable<IPerson> {
    return this.dataService.read('/persons/{personId}', { personId });
  }

  private fetchDebts(personId: number): Observable<IDebt[]> {
    return this.dataService.readAll('/persons/{personId}/debts', { personId });
  }
}
