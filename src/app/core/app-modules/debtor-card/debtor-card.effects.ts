import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

import {
  IActionType,
  IFetchDebtsAction,
  IFetchDebtsSuccessAction,
  IFetchPersonAction,
  IFetchPersonSuccessAction,
  IInitByDebtIdAction,
  IInitByPersonIdAction,
  ISelectDebtAction,
} from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';
import { IAppState } from '../../state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * NOTE: this is a quick patch that places the operators
 * in the Observable prototype that persist across the app
 * TODO(a.tymchuk, i.kibisov, d.maltsev, i.lobanov): import the lettable operators and pipe them
 * wherever applicable accross the whole codebase
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class DebtorCardEffects {

  static ENTITY_TYPE_DEBT = 19;

  @Effect()
  initByDebtId$ = this.actions
    .ofType(IActionType.INIT_BY_DEBT_ID)
    .pipe(mergeMap((action: IInitByDebtIdAction) => {
      const { debtId } = action.payload;
      return this.fetchDebt(debtId)
      .pipe(mergeMap(debt => [
        this.createFetchPersonAction(debt.personId),
        this.createFetchDebtsAction(debt.personId, debt.id),
      ]));
    }));

  @Effect()
  initByPersonId$ = this.actions
    .ofType(IActionType.INIT_BY_PERSON_ID)
    .pipe(mergeMap((action: IInitByPersonIdAction) => {
      const { personId } = action.payload;
      return [
        this.createFetchPersonAction(personId),
        this.createFetchDebtsAction(personId),
      ];
    }));

  @Effect()
  fetchPerson$ = this.actions
    .ofType(IActionType.FETCH_PERSON)
    .mergeMap((action: IFetchPersonAction) => {
      return this.fetchPerson(action.payload.personId)
        .pipe(
          map(person => this.createFetchPersonSuccessAction(person)),
          catchError(this.notificationService.fetchError().entity('entities.person.gen.plural').callback())
        );
    });

  @Effect()
  fetchDebts$ = this.actions
    .ofType(IActionType.FETCH_DEBTS)
    .pipe(mergeMap((action: IFetchDebtsAction) => {
      const { personId, selectedDebtId } = action.payload;
      return this.fetchDebts(personId)
        .pipe(
          mergeMap(debts => [
            this.createFetchDebtsSuccessAction(debts),
            this.createSelectDebtAction(selectedDebtId || (debts && debts[0].id)),
          ]),
          catchError(this.notificationService.fetchError().entity('entities.debt.gen.plural').callback())
        );
    }));

  @Effect()
  refreshDebts$ = this.actions
    .ofType(IActionType.REFRESH_DEBTS)
    .pipe(
      withLatestFrom(this.store.select(state => state.debtorCard)),
      switchMap(([_, cardState]) => {
        return [
          { type: IActionType.FETCH_DEBTS,
            payload: {
              personId: cardState.person.data.id,
              selectedDebtId: cardState.selectedDebtId
            }
          } as IFetchDebtsAction
        ];
    }));

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private createFetchDebtsAction(personId: number, selectedDebtId: number = null): IFetchDebtsAction {
    return {
      type: IActionType.FETCH_DEBTS,
      payload: { personId, selectedDebtId, entityTypeId: selectedDebtId && DebtorCardEffects.ENTITY_TYPE_DEBT },
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
      payload: { debtId, entityId: debtId, entityTypeId: debtId && DebtorCardEffects.ENTITY_TYPE_DEBT },
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
