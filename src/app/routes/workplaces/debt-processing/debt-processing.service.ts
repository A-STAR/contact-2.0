import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAGridSortModel, IAGridState, IAGridRequestParams } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IDebt, IDebtProcessingState } from './debt-processing.interface';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class DebtProcessingService {
  static DEBT_PROCESSING_FETCH         = 'DEBT_PROCESSING_FETCH';
  static DEBT_PROCESSING_FETCH_SUCCESS = 'DEBT_PROCESSING_FETCH_SUCCESS';

  constructor(private store: Store<IAppState>) {}

  get debts$(): Observable<Array<IDebt>> {
    return this.state$.map(state => state.debts).distinctUntilChanged();
  }

  fetch(filters: FilterObject, params: IAGridRequestParams): void {
    this.store.dispatch({
      payload: { filters, ...params },
      type: DebtProcessingService.DEBT_PROCESSING_FETCH,
    });
  }

  clear(): void {
    this.store.dispatch({
      payload: { data: [], total: 0 },
      type: DebtProcessingService.DEBT_PROCESSING_FETCH_SUCCESS,
    });
  }

  private get state$(): Observable<IDebtProcessingState> {
    return this.store.select(state => state.debtProcessing);
  }
}
