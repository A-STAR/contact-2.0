import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../state/state.interface';
import { IActionType } from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class DebtorCardService {
  constructor(
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
      // TODO(d.maltsev): get selected debt instead of first
      .select(state => state.debtorCard.debts && state.debtorCard.debts[0])
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

  /**
   * Opens debtor card by debtId:
   * 1. fetches debt by `debtId` (`GET /debts/{debtId}`)
   * 2. fetches person by `debt.personId` (`GET /persons/{personsId}`)
   * 3. fetches other person debts by `debt.personId` (`GET /persons/{personsId}/debts`)
   *
   * @param debtId
   */
  openByDebtId(debtId: number): void {
    this.store.dispatch({
      type: IActionType.OPEN_BY_DEBT_ID,
      payload: { debtId },
    });
  }

  /**
   * Initializes debtor card by personId:
   * 1. fetches debts by `personId` (`GET /persons/{personsId}/debts`)
   * 2. fetches person by `personId` (`GET /persons/{personsId}`)
   *
   * @param personId
   */
  initialize(personId: number): void {
    this.store.dispatch({
      type: IActionType.INITIALIZE,
      payload: { personId },
    });
  }
}
