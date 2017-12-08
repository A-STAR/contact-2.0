import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import {
  IActionType,
  IDebtorCardAction,
  IFetchPersonAction,
  IFetchPersonDebtsAction,
  IFetchPersonDebtsSuccessAction,
  IFetchPersonSuccessAction,
  IInitByDebtIdAction,
  IInitByPersonIdAction,
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
        .mergeMap(debt => this.createFetchActions(debt.personId, debtId))
        .catch(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback());
    });

  @Effect()
  initByPersonId$ = this.actions
    .ofType(IActionType.INIT_BY_PERSON_ID)
    .map((action: IInitByPersonIdAction) => this.createFetchActions(action.payload.personId));

  @Effect()
  fetchPerson$ = this.actions
    .ofType(IActionType.FETCH_PERSON)
    .mergeMap((action: IFetchPersonAction) => {
      return this.fetchPerson(action.payload.personId)
        .map(person => this.createFetchPersonSuccessAction(person))
        .catch(this.notificationService.fetchError().entity('entities.person.gen.plural').callback());
    });

  @Effect()
  fetchPersonDebts$ = this.actions
    .ofType(IActionType.FETCH_PERSON_DEBTS)
    .mergeMap((action: IFetchPersonDebtsAction) => {
      return this.fetchPersonDebts(action.payload.personId)
        .map(person => this.createFetchPersonDebtsSuccessAction(person))
        .catch(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private createFetchActions(personId: number, selectedDebtId: number = null): IDebtorCardAction[] {
    return [
      {
        type: IActionType.FETCH_PERSON,
        payload: { personId },
      },
      {
        type: IActionType.FETCH_PERSON_DEBTS,
        payload: { personId },
      },
      {
        type: IActionType.SELECT_PERSON_DEBT,
        payload: { debtId: selectedDebtId }
      },
    ];
  }

  private createFetchPersonDebtsSuccessAction(debts: IDebt[]): IFetchPersonDebtsSuccessAction {
    return {
      type: IActionType.FETCH_PERSON_DEBTS_SUCCESS,
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

  private fetchPersonDebts(personId: number): Observable<IDebt[]> {
    return this.dataService.readAll('/persons/{personId}/debts', { personId });
  }
}
