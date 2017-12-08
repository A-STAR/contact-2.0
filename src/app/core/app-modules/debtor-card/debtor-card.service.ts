import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IAppState } from '../../state/state.interface';
import { IActionType, INavigationParams } from './debtor-card.interface';
import { IDebt, IPerson } from '../app-modules.interface';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DebtorCardService {
  constructor(
    private contentTabService: ContentTabService,
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
   * Initializes debtor card by debtId:
   * 1. fetches debt by `debtId` (`GET /debts/{debtId}`)
   * 2. fetches person by `debt.personId` (`GET /persons/{personsId}`)
   * 3. fetches other person debts by `debt.personId` (`GET /persons/{personsId}/debts`)
   *
   * @param debtId
   */
  initByDebtId(debtId: number): void {
    this.store.dispatch({
      type: IActionType.INIT_BY_DEBT_ID,
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
  initByPersonId(personId: number): void {
    this.store.dispatch({
      type: IActionType.INIT_BY_PERSON_ID,
      payload: { personId },
    });
  }

  /**
   * Navigates to debtor card by `debtId` or `personId`
   */
  navigate(queryParams: Partial<INavigationParams>): Promise<boolean> {
    this.contentTabService.removeTabByPath(`\/workplaces\/debt-processing\/(.+)`);
    return this.router.navigate([ '/workplaces/debt-processing' ], { queryParams });
  }
}
