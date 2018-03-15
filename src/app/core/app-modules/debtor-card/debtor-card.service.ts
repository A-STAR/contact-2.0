import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../../state/state.interface';
import { IActionType, IDataStatus } from './debtor-card.interface';

import { AbstractActionService } from '../../state/action.service';
import { RoutingService } from 'app/core/routing/routing.service';

@Injectable()
export class DebtorCardService extends AbstractActionService {
  readonly personId$ = this.store.pipe(
    select(state => state.debtorCard.person.data && state.debtorCard.person.data.id),
  );

  readonly person$ = this.store.pipe(
    select(state => state.debtorCard.person.data),
  );

  readonly selectedDebtId$ = this.store.pipe(
    select(state => state.debtorCard.selectedDebtId),
  );

  readonly entityTypeId$ = this.store.pipe(
    select(state => state.debtorCard.entityTypeId),
  );

  readonly entityId$ = this.store.pipe(
    select(state => state.debtorCard.entityId),
  );

  readonly selectedDebt$ = this.store.pipe(
    select(state => state.debtorCard),
    map(slice => {
      const { debts, selectedDebtId } = slice;
      return (debts.data || []).find(debt => debt.id === selectedDebtId);
    }),
    distinctUntilChanged(),
  );

  readonly debts$ = this.store.pipe(
    select(state => state.debtorCard.debts.data),
  );

  readonly isCompany$ = this.store.pipe(
    select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode),
    map(typeCode => [2, 3].includes(typeCode)),
    distinctUntilChanged(),
  );

  readonly isPerson$ = this.store.pipe(
    select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode),
    map(typeCode => typeCode === 1),
    distinctUntilChanged(),
  );

  readonly hasDebts$ = this.store.pipe(
    select(state => state.debtorCard.debts.status === IDataStatus.LOADED),
  );

  readonly hasPerson$ = this.store.pipe(
    select(state => state.debtorCard.person.status === IDataStatus.LOADED),
  );

  readonly hasLoaded$ = this.store.pipe(
    select(state => state.debtorCard),
    map(slice => slice.debts.status === IDataStatus.LOADED && slice.person.status === IDataStatus.LOADED),
    distinctUntilChanged(),
  );

  readonly hasFailed$ = this.store.pipe(
    select(state => state.debtorCard),
    map(slice => slice.debts.status === IDataStatus.FAILED || slice.person.status === IDataStatus.FAILED),
    distinctUntilChanged(),
  );

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
    private routingService: RoutingService,
  ) {
    super();
  }

  openByDebtId(debtId: number): void {
    this.routingService.navigate([ '/workplaces', `debtor-card/${debtId}` ]);
  }

  initByDebtId(debtId: number): void {
    this.store.dispatch({
      type: IActionType.INIT_BY_DEBT_ID,
      payload: { debtId },
    });
  }

  selectDebt(debtId: number): void {
    this.store.dispatch({
      type: IActionType.SELECT_DEBT,
      payload: { debtId },
    });
  }

  refreshDebts(): void {
    this.store.dispatch({ type: IActionType.REFRESH_DEBTS });
  }
}
