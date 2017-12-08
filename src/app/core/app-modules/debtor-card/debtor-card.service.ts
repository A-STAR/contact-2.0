import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../state/state.interface';
import { IActionType } from './debtor-card.interface';

@Injectable()
export class DebtorCardService {
  constructor(
    private store: Store<IAppState>,
  ) {}

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
}
