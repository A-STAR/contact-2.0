import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAGridSortModel, IAGridState } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IDebt, IDebtProcessingState } from './debt-processing.interface';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class DebtProcessingService {
  static DEBT_PROCESSING_FETCH         = 'DEBT_PROCESSING_FETCH';
  static DEBT_PROCESSING_FETCH_SUCCESS = 'DEBT_PROCESSING_FETCH_SUCCESS';

  constructor(private store: Store<IAppState>) {}

  get currentPage$(): Observable<number> {
    return this.grid$.map(grid => grid.currentPage).distinctUntilChanged();
  }

  get pageSize$(): Observable<number> {
    return this.grid$.map(grid => grid.pageSize).distinctUntilChanged();
  }

  get sorters$(): Observable<Array<IAGridSortModel>> {
    return this.grid$.map(grid => grid.sorters).distinctUntilChanged();
  }

  get selected$(): Observable<Array<IDebt>> {
    return this.grid$.map(grid => grid.selectedRows).distinctUntilChanged();
  }

  get debts$(): Observable<Array<IDebt>> {
    return this.state$.map(state => state.debts).distinctUntilChanged();
  }

  fetch(filters: FilterObject): void {
    this.dispatch(DebtProcessingService.DEBT_PROCESSING_FETCH, { filters });
  }

  filter(filters: FilterObject): void {
    this.dispatch(DebtProcessingService.DEBT_PROCESSING_FETCH, { currentPage: 1, filters });
  }

  dispatch(type: string, payload: number | object = null): void {
    this.store.dispatch({ type, payload });
  }

  private get grid$(): Observable<IAGridState> {
    return this.state$.map(state => state.grid);
  }

  private get state$(): Observable<IDebtProcessingState> {
    return this.store.select(state => state.debtProcessing);
  }
}
