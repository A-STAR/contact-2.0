import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../state/state.interface';
import { IActionType } from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';

@Injectable()
export class DebtorCardService {
  constructor(
    private router: Router,
    private store: Store<IAppState>,
  ) {}

  get personId$(): Observable<number> {
    return this.store
      .select(state => state.debtorCard.person && state.debtorCard.person.id)
      .distinctUntilChanged();
  }

  get person$(): Observable<IPerson> {
    return this.store
      .select(state => state.debtorCard.person)
      .distinctUntilChanged();
  }

  get selectedDebtId$(): Observable<number> {
    return this.store
      .select(state => state.debtorCard.selectedDebtId)
      .distinctUntilChanged();
  }

  get selectedDebt$(): Observable<IDebt> {
    return this.store
      .select(state => state.debtorCard)
      .map(slice => {
        const { debts, selectedDebtId } = slice;
        return (debts || []).find(debt => debt.id === selectedDebtId);
      })
      .distinctUntilChanged();
  }

  get debts$(): Observable<IDebt[]> {
    return this.store
      .select(state => state.debtorCard.debts)
      .distinctUntilChanged();
  }

  get isCompany$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person && state.debtorCard.person.typeCode)
      .map(typeCode => [2, 3].includes(typeCode))
      .distinctUntilChanged();
  }

  get isPerson$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person && state.debtorCard.person.typeCode)
      .map(typeCode => typeCode === 1)
      .distinctUntilChanged();
  }

  get hasDebts$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.debts)
      .map(Boolean)
      .distinctUntilChanged();
  }

  get hasPerson$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person)
      .map(Boolean)
      .distinctUntilChanged();
  }

  openByDebtId(debtId: number): void {
    this.initByDebtId(debtId);
    this.navigate(debtId);
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

  private navigate(debtId: number): Promise<boolean> {
    return this.router.navigate([ `/workplaces/debtor-card/${debtId}` ] );
  }
}
