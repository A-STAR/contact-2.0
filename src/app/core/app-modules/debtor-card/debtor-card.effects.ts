import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';

import {
  IActionType,
  IDebtorCardAction,
  IFetchPersonAction,
  IFetchDebtsAction,
  IFetchDebtsSuccessAction,
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
  openByDebtId$ = this.actions
    .ofType(IActionType.OPEN_BY_DEBT_ID)
    .mergeMap((action: IInitByDebtIdAction) => {
      const { debtId } = action.payload;
      return this.fetchDebt(debtId)
        .do(debt => this.navigate(debt.personId))
        .mergeMap(debt => this.createFetchActions(debt.personId, debtId))
        .catch(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback());
    });

  @Effect()
  initialize$ = this.actions
    .ofType(IActionType.INITIALIZE)
    .mergeMap((action: IInitByPersonIdAction) => this.createFetchActions(action.payload.personId));

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
      return this.fetchDebts(action.payload.personId)
        .map(person => this.createFetchDebtsSuccessAction(person))
        .catch(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private contentTabService: ContentTabService,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private router: Router,
  ) {}

  private createFetchActions(personId: number, selectedDebtId: number = null): IDebtorCardAction[] {
    return [
      {
        type: IActionType.FETCH_PERSON,
        payload: { personId },
      },
      {
        type: IActionType.FETCH_DEBTS,
        payload: { personId },
      },
      {
        type: IActionType.SELECT_DEBT,
        payload: { debtId: selectedDebtId }
      },
    ];
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

  private navigate(personId: number): Promise<boolean> {
    this.contentTabService.removeTabByPath(`\/workplaces\/debtor-card\/(.+)`);
    return this.router.navigate([ '/workplaces/debtor-card' ]);
  }
}
