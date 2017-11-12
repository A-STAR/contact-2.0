import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import {
  IContractor, IContractorsAndPortfoliosState,
  IContractorManager, IPortfolio, IPortfolioMoveRequest,
  INumberMap
} from './contractors-and-portfolios.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

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
  static MANAGERS_FETCH_SUCCESS = 'MANAGERS_FETCH_SUCCESS';
  static MANAGER_FETCH          = 'MANAGER_FETCH';
  static MANAGER_FETCH_SUCCESS  = 'MANAGER_FETCH_SUCCESS';
  static MANAGERS_CLEAR         = 'MANAGERS_CLEAR';
  static MANAGER_SELECT         = 'MANAGER_SELECT';
  static MANAGER_CREATE         = 'MANAGER_CREATE';
  static MANAGER_CREATE_SUCCESS = 'MANAGER_CREATE_SUCCESS';
  static MANAGER_UPDATE         = 'MANAGER_UPDATE';
  static MANAGER_UPDATE_SUCCESS = 'MANAGER_UPDATE_SUCCESS';
  static MANAGER_DELETE         = 'MANAGER_DELETE';
  static MANAGER_DELETE_SUCCESS = 'MANAGER_DELETE_SUCCESS';
  static MANAGERS_CLEAR_SELECTED_FOR_CONTRACTOR = 'MANAGERS_CLEAR_SELECTED_FOR_CONTRACTOR';

  static PORTFOLIO_FETCH          = 'PORTFOLIO_FETCH';
  static PORTFOLIOS_FETCH         = 'PORTFOLIOS_FETCH';
  static PORTFOLIOS_FETCH_SUCCESS = 'PORTFOLIOS_FETCH_SUCCESS';
  static PORTFOLIOS_CLEAR         = 'PORTFOLIOS_CLEAR';
  static PORTFOLIO_SELECT         = 'PORTFOLIO_SELECT';
  static PORTFOLIO_CREATE         = 'PORTFOLIO_CREATE';
  static PORTFOLIO_CREATE_SUCCESS = 'PORTFOLIO_CREATE_SUCCESS';
  static PORTFOLIO_UPDATE         = 'PORTFOLIO_UPDATE';
  static PORTFOLIO_UPDATE_SUCCESS = 'PORTFOLIO_UPDATE_SUCCESS';
  static PORTFOLIO_MOVE           = 'PORTFOLIO_MOVE';
  static PORTFOLIO_MOVE_SUCCESS   = 'PORTFOLIO_MOVE_SUCCESS';
  static PORTFOLIO_DELETE         = 'PORTFOLIO_DELETE';
  static PORTFOLIO_DELETE_SUCCESS = 'PORTFOLIO_DELETE_SUCCESS';
  static EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED = 'EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED';

  constructor(
    private store: Store<IAppState>,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private valueConverterService: ValueConverterService,
  ) {}

  get currentStore(): any {
    return this.store;
  }

  // get contractors$(): Observable<Array<IContractor>> {
  //   return this.state
  //     .map(state => state.contractors)
  //     .distinctUntilChanged();
  // }

  // get managers$(): Observable<Array<IContractorManager>> {
  //   return this.state
  //     .map(state => state.managers)
  //     .distinctUntilChanged();
  // }

  get portfolios$(): Observable<Array<IPortfolio>> {
    return this.state
      .map(state => state.portfolios)
      .distinctUntilChanged();
  }

  get selectedContractorId$(): Observable<number> {
    return this.state
      .map(state => state.selectedContractorId)
      .distinctUntilChanged();
  }

  get selectedManagerId$(): Observable<any> {
    return this.state
      .map(state => {
        this.managerMapping = state.mapContractorToSelectedManager;
        return state.mapContractorToSelectedManager;
      })
      .distinctUntilChanged();
  }
  // TODO typing
  managerMapping: any;

  // get mapContractorToSelectedPortfolio$(): Observable<IPortfolio> {
  //   return this.state
  //     .map(state => state.portfolios && state.portfolios.find(portfolio => portfolio.id === state.selectedPortfolioId))
  //     .distinctUntilChanged();
  // }

  readAllContractors(): Observable<IContractor[]> {
    return this.dataService.readAll('/contractors')
      .catch(
        this.notificationsService.fetchError().entity('entities.contractors.gen.plural').callback()
      ) as Observable<IContractor[]>;
  }
  readAllContractorsExeptCurrent(currentContractorId: number): Observable<IContractor[]> {
    return this.dataService.readAll('/contractors')
      .take(2)
      .map(contractors => contractors ? contractors.filter(contractor => contractor.id !== currentContractorId) : null )
      .catch(
        this.notificationsService.fetchError().entity('entities.contractors.gen.plural').callback()
      ) as Observable<IContractor[]>;
  }
  readContractor(contractorId: number): Observable<IContractor> {
    return this.dataService.read('/contractors/{contractorId}', { contractorId })
              .catch(this.notificationsService.fetchError().entity('entities.contractors.gen.singular').callback());
  }

  selectContractor(contractorId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_SELECT, { contractorId });
  }

  createContractor(contractor: IContractor): Observable<void> {
    return this.dataService.create('/contractors', {}, contractor)
            .catch(this.notificationsService.createError().entity('entities.contractors.gen.singular').callback());
  }

  updateContractor(contractorId: number, contractor: IContractor): Observable<void> {
    // this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_UPDATE, { contractorId, contractor });
    return this.dataService.update('/contractors/{contractorId}', { contractorId }, contractor)
            .catch(this.notificationsService.updateError().entity('entities.contractors.gen.singular').callback());
  }

  deleteContractor(contractorId: Number): Observable<any> {
    // this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_DELETE);
    return this.dataService.delete('/contractors/{contractorId}', { contractorId })
            .take(1)
            .catch(this.notificationsService.deleteError().entity('entities.contractors.gen.singular').callback());
  }

  readManagersForContractor(contractorId: number): Observable<any> {
    // this.dispatch(ContractorsAndPortfoliosService.MANAGERS_FETCH, { contractorId });
    return this.dataService.readAll('/contractors/{contractorId}/managers', { contractorId })
            .take(1)
            .catch(this.notificationsService.fetchError().entity('entities.managers.gen.plural').callback());
  }

  selectManager(contractorId: number, managerId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_SELECT, {
      mapContractorToSelectedManager: {
        [contractorId]: managerId
      }
    });
  }

  readManager(contractorId: number, managerId: number): Observable<any> {
    return this.dataService.read('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId })
            .catch(this.notificationsService.fetchError().entity('entities.managers.gen.singular').callback());
  }

  createManager(contractorId: number, manager: IContractorManager): Observable<any> {
    return this.dataService.create('/contractors/{contractorId}/managers', { contractorId }, manager)
            .catch(this.notificationsService.createError().entity('entities.managers.gen.singular').callback());
  }

  updateManager(contractorId: number, managerId: number, manager: IContractorManager): Observable<any> {
    return this.dataService.update('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId }, manager)
            .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').callback());
  }

  deleteManager(contractorId: number, managerId: number): Observable<any> {
    return this.dataService.delete('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId })
            .catch(this.notificationsService.deleteError().entity('entities.managers.gen.singular').callback());
  }

  readPortfolios(contractorId: Number): Observable<any> {
    return this.dataService.readAll('/contractors/{contractorId}/portfolios', { contractorId })
              .catch(this.notificationsService.fetchError().entity('entities.portfolios.gen.plural').callback());
  }

  readPortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService.read('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
      // TODO create and use matching key in dictionary
      .catch(this.notificationsService.fetchError().entity('entities.contractors.gen.singular').callback());
  }

  createPortfolio(contractorId: number, portfolio: IPortfolio): Observable<any> {
    // TODO remove temporary patch
    portfolio.stageCode = 1;
    return this.dataService.create('/contractors/{contractorId}/portfolios', { contractorId }, portfolio)
              .catch(this.notificationsService.createError().entity('entities.portfolios.gen.singular').callback());
  }

  updatePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioMoveRequest
  ): Observable<any> {
    return this.dataService
              .update('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio)
              .catch(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').callback());
  }

  movePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioMoveRequest
  ): Observable<any>  {
    console.log(arguments);
    return this.dataService
            .update('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio)
            .catch(this.notificationsService.error('errors.default.move').entity('entities.portfolios.gen.singular').callback());
  }

  get mapContractorToSelectedPortfolio$(): Observable<any> {
    return this.state
      .map(state => {
        this.portfolioMapping = state.mapContractorToSelectedPortfolio;
        return state.mapContractorToSelectedPortfolio;
      })
      .distinctUntilChanged();
  }

  portfolioMapping: INumberMap;

  // fetchPortfolio(contractorId: number, portfolioId: number): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_FETCH, { contractorId, portfolioId });
  // }

  // clearPortfolios(): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIOS_CLEAR);
  // }
  deletePortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService
              .delete('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
              .catch(this.notificationsService.deleteError().entity('entities.portfolios.entity.singular').callback());
  }

  selectPortfolio(contractorId: number, portfolioId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_SELECT, {
        mapContractorToSelectedPortfolio: {
        [contractorId]: portfolioId
      }
    });
  }
  // createPortfolio(contractorId: number, portfolio: IPortfolio): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_CREATE, { contractorId, portfolio });
  // }

  // updatePortfolio(contractorId: number, portfolioId: number, portfolio: IPortfolio): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_UPDATE, { contractorId, portfolioId, portfolio });
  // }

  // movePortfolio(contractorId: number, newContractorId: number, portfolioId: number): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_MOVE, { contractorId, newContractorId, portfolioId });
  // }

  // deletePortfolio(contractorId: number): void {
  //   this.dispatch(ContractorsAndPortfoliosService.PORTFOLIO_DELETE, { contractorId });
  // }

  get state(): Observable<IContractorsAndPortfoliosState> {
    return this.store.select(state => state.contractorsAndPortfolios)
      .filter(Boolean);
  }

  private dispatch(type: string, payload?: any): void {
    this.store.dispatch({ type, payload });
  }
}
