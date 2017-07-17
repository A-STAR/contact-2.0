import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IContractorsAndPortfoliosState, IContractor, IContractorManager, IPortfolio } from './contractors-and-portfolios.interface';

@Injectable()
export class ContractorsAndPortfoliosService {
  static CONTRACTORS_FETCH         = 'CONTRACTORS_FETCH';
  static CONTRACTORS_FETCH_SUCCESS = 'CONTRACTORS_FETCH_SUCCESS';
  static CONTRACTOR_FETCH          = 'CONTRACTOR_FETCH';
  static CONTRACTOR_FETCH_SUCCESS  = 'CONTRACTOR_FETCH_SUCCESS';
  static CONTRACTORS_CLEAR         = 'CONTRACTORS_CLEAR';
  static CONTRACTOR_SELECT         = 'CONTRACTOR_SELECT';
  static CONTRACTOR_CREATE         = 'CONTRACTOR_CREATE';
  static CONTRACTOR_CREATE_SUCCESS = 'CONTRACTOR_CREATE_SUCCESS';
  static CONTRACTOR_UPDATE         = 'CONTRACTOR_UPDATE';
  static CONTRACTOR_UPDATE_SUCCESS = 'CONTRACTOR_UPDATE_SUCCESS';
  static CONTRACTOR_DELETE         = 'CONTRACTOR_DELETE';
  static CONTRACTOR_DELETE_SUCCESS = 'CONTRACTOR_DELETE_SUCCESS';

  static MANAGERS_FETCH         = 'MANAGERS_FETCH';
  static MANAGER_FETCH          = 'MANAGER_FETCH';
  static MANAGERS_FETCH_SUCCESS = 'MANAGERS_FETCH_SUCCESS';
  static MANAGERS_CLEAR         = 'MANAGERS_CLEAR';
  static MANAGER_SELECT         = 'MANAGER_SELECT';
  static MANAGER_CREATE         = 'MANAGER_CREATE';
  static MANAGER_UPDATE         = 'MANAGER_UPDATE';
  static MANAGER_DELETE         = 'MANAGER_DELETE';
  static MANAGER_DELETE_SUCCESS = 'MANAGER_DELETE_SUCCESS';

  static PORTFOLIOS_FETCH         = 'PORTFOLIOS_FETCH';
  static PORTFOLIO_FETCH          = 'PORTFOLIO_FETCH';
  static PORTFOLIOS_FETCH_SUCCESS = 'PORTFOLIOS_FETCH_SUCCESS';
  static PORTFOLIOS_CLEAR         = 'PORTFOLIOS_CLEAR';
  static PORTFOLIO_SELECT         = 'PORTFOLIO_SELECT';
  static PORTFOLIO_CREATE         = 'PORTFOLIO_CREATE';
  static PORTFOLIO_UPDATE         = 'PORTFOLIO_UPDATE';
  static PORTFOLIO_DELETE         = 'PORTFOLIO_DELETE';

  constructor(private store: Store<IAppState>) {}

  get contractors$(): Observable<Array<IContractor>> {
    return this.state
      .map(state => state.contractors)
      .distinctUntilChanged();
  }

  get managers$(): Observable<Array<IContractorManager>> {
    return this.state
      .map(state => state.managers)
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

  get selectedManager$(): Observable<IContractorManager> {
    return this.state
      .map(state => state.managers && state.managers.find(manager => manager.id === state.selectedManagerId))
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

  fetchContractor(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_FETCH, { contractorId });
  }

  clearContractors(): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTORS_CLEAR);
  }

  selectContractor(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_SELECT, { contractorId });
  }

  createContractor(contractor: IContractor): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_CREATE, { contractor });
  }

  updateContractor(contractorId: number, contractor: IContractor): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_UPDATE, { contractorId, contractor });
  }

  deleteContractor(): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_DELETE);
  }

  fetchManagers(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGERS_FETCH, { contractorId });
  }

  fetchManager(contractorId: number, managerId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_FETCH, { contractorId, managerId });
  }

  clearManagers(): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGERS_CLEAR);
  }

  selectManager(managerId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_SELECT, { managerId });
  }

  createManager(contractorId: number, manager: IContractorManager): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_CREATE, { contractorId, manager });
  }

  updateManager(contractorId: number, managerId: number, manager: IContractorManager): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_UPDATE, { contractorId, managerId, manager });
  }

  deleteManager(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_DELETE, { contractorId });
  }

  fetchPortfolios(): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH);
  }

  fetchPortfolio(portfolioId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_FETCH, { portfolioId });
  }

  clearPortfolios(): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIOS_CLEAR);
  }

  selectPortfolio(portfolioId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_SELECT, { portfolioId });
  }

  createPortfolio(contractorId: number, portfolio: IPortfolio): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_CREATE, { contractorId, portfolio });
  }

  updatePortfolio(contractorId: number, portfolioId: number, portfolio: IPortfolio): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_UPDATE, { contractorId, portfolioId, portfolio });
  }

  deletePortfolio(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_DELETE, { contractorId });
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
