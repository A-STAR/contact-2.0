import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IAppState } from '../../state/state.interface';
import { IActionType, IDataStatus } from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';

import { AbstractActionService } from '../../state/action.service';
import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';

@Injectable()
export class DebtorCardService extends AbstractActionService {
  constructor(
    protected actions: Actions,
    private contentTabService: ContentTabService,
    private router: Router,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get personId$(): Observable<number> {
    return this.store
      .select(state => state.debtorCard.person.data && state.debtorCard.person.data.id);
  }

  get person$(): Observable<IPerson> {
    return this.store
      .select(state => state.debtorCard.person.data);
  }

  get selectedDebtId$(): Observable<number> {
    return this.store
      .select(state => state.debtorCard.selectedDebtId);
  }

  get selectedDebt$(): Observable<IDebt> {
    return this.store
      .select(state => state.debtorCard)
      .map(slice => {
        const { debts, selectedDebtId } = slice;
        return (debts.data || []).find(debt => debt.id === selectedDebtId);
      })
      .distinctUntilChanged();
  }

  get debts$(): Observable<IDebt[]> {
    return this.store
      .select(state => state.debtorCard.debts.data);
  }

  get isCompany$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode)
      .map(typeCode => [2, 3].includes(typeCode))
      .distinctUntilChanged();
  }

  get isPerson$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode)
      .map(typeCode => typeCode === 1)
      .distinctUntilChanged();
  }

  get hasDebts$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.debts.status === IDataStatus.LOADED);
  }

  get hasPerson$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard.person.status === IDataStatus.LOADED);
  }

  get hasLoaded$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard)
      .map(slice => slice.debts.status === IDataStatus.LOADED && slice.person.status === IDataStatus.LOADED)
      .distinctUntilChanged();
  }

  get hasFailed$(): Observable<boolean> {
    return this.store
      .select(state => state.debtorCard)
      .map(slice => slice.debts.status === IDataStatus.FAILED || slice.person.status === IDataStatus.FAILED)
      .distinctUntilChanged();
  }

  openByDebtId(debtId: number): Promise<boolean> {
    this.contentTabService.removeTabByPath(`\/workplaces\/debtor-card\/(.+)`);
    return this.router.navigate([ `/workplaces/debtor-card/${debtId}` ] );
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