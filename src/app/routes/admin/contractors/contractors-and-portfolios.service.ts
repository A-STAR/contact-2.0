import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IContractorsAndPortfoliosState, IContractor, IPortfolio } from './contractors-and-portfolios.interface';

@Injectable()
export class ContractorsAndPortfoliosService {
  static CONTRACTORS_FETCH         = 'CONTRACTORS_FETCH';
  static CONTRACTORS_FETCH_SUCCESS = 'CONTRACTORS_FETCH_SUCCESS';
  static CONTRACTORS_CLEAR         = 'CONTRACTORS_CLEAR';
  static PORTFOLIOS_FETCH          = 'PORTFOLIOS_FETCH';
  static PORTFOLIOS_FETCH_SUCCESS  = 'PORTFOLIOS_FETCH_SUCCESS';
  static PORTFOLIOS_CLEAR          = 'PORTFOLIOS_CLEAR';

  constructor(private store: Store<IAppState>) {}

  get contractors$(): Observable<Array<IContractor>> {
    return this.state
      .map(state => state.contractors)
      .distinctUntilChanged();
  }

  get portfolios$(): Observable<Array<IPortfolio>> {
    return this.state
      .map(state => state.portfolios)
      .distinctUntilChanged();
  }

  get selectedContractor$(): Observable<IContractor> {
    return this.state
      .map(state => state.contractors && state.contractors.find(contractor => contractor.id === state.selectedContractorId))
      .distinctUntilChanged();
  }

  get selectedPortfolio$(): Observable<IPortfolio> {
    return this.state
      .map(state => state.portfolios && state.portfolios.find(portfolio => portfolio.id === state.selectedPortfolioId))
      .distinctUntilChanged();
  }

  fetchContractors(): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTORS_FETCH);
  }

  clearContractors(): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTORS_CLEAR);
  }

  fetchPortfolios(): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH);
  }

  clearPortfolios(): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIOS_CLEAR);
  }

  private get state(): Observable<IContractorsAndPortfoliosState> {
    return this.store.select(state => state.contractorsAndPortfolios);
  }

  private dispatch(type: string, payload?: any): void {
    this.store.dispatch({
      type,
      payload
    });
  }
}
