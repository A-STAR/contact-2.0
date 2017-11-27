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

@Injectable()
export class ContractorsAndPortfoliosService {
  static CONTRACTORS_FETCH                      = 'CONTRACTORS_FETCH';
  static CONTRACTOR_FETCH                       = 'CONTRACTOR_FETCH';
  static CONTRACTOR_SELECT                      = 'CONTRACTOR_SELECT';
  static CONTRACTOR_CREATE                      = 'CONTRACTOR_CREATE';
  static CONTRACTOR_UPDATE                      = 'CONTRACTOR_UPDATE';
  static CONTRACTOR_DELETE                      = 'CONTRACTOR_DELETE';

  static MANAGERS_FETCH                         = 'MANAGERS_FETCH';
  static MANAGER_FETCH                          = 'MANAGER_FETCH';
  static MANAGERS_CLEAR                         = 'MANAGERS_CLEAR';
  static MANAGER_SELECT                         = 'MANAGER_SELECT';
  static MANAGER_CREATE                         = 'MANAGER_CREATE';
  static MANAGER_UPDATE                         = 'MANAGER_UPDATE';
  static MANAGER_DELETE                         = 'MANAGER_DELETE';

  static PORTFOLIO_FETCH                        = 'PORTFOLIO_FETCH';
  static PORTFOLIOS_FETCH                       = 'PORTFOLIOS_FETCH';
  static PORTFOLIOS_CLEAR                       = 'PORTFOLIOS_CLEAR';
  static PORTFOLIO_SELECT                       = 'PORTFOLIO_SELECT';
  static PORTFOLIO_CREATE                       = 'PORTFOLIO_CREATE';
  static PORTFOLIO_UPDATE                       = 'PORTFOLIO_UPDATE';
  static PORTFOLIO_MOVE                         = 'PORTFOLIO_MOVE';
  static PORTFOLIO_DELETE                       = 'PORTFOLIO_DELETE';
  static PORTFOLIO_DELETE_SUCCESS               = 'PORTFOLIO_DELETE_SUCCESS';
  static EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED = 'EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED';

  constructor(
    private store: Store<IAppState>,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  get selectedContractorId$(): Observable<number> {
    return this.state
      .map(state => state.selectedContractorId)
      .distinctUntilChanged();
  }

  get selectedPortfolioId$(): Observable<number> {
    return this.state
      .map(state => state.selectedPortfolioId)
      .distinctUntilChanged();
  }

  get selectedManagerId$(): Observable<number> {
    return this.state
      .map(state => null)
      .distinctUntilChanged();
  }

  readAllContractors(): Observable<IContractor[]> {
    return this.dataService.readAll('/contractors')
      .catch(
        this.notificationsService.fetchError().entity('entities.contractors.gen.plural').callback()
      ) as Observable<IContractor[]>;
  }

  readAllContractorsExeptCurrent(currentContractorId: number): Observable<IContractor[]> {
    return this.dataService.readAll('/contractors')
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
    this.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_SELECT, { selectedContractorId: contractorId });
  }

  createContractor(contractor: IContractor): Observable<void> {
    return this.dataService.create('/contractors', {}, contractor)
      .catch(this.notificationsService.createError().entity('entities.contractors.gen.singular').callback());
  }

  updateContractor(contractorId: number, contractor: IContractor): Observable<void> {
    return this.dataService.update('/contractors/{contractorId}', { contractorId }, contractor)
            .catch(this.notificationsService.updateError().entity('entities.contractors.gen.singular').callback());
  }

  deleteContractor(contractorId: Number): Observable<any> {
    return this.dataService.delete('/contractors/{contractorId}', { contractorId })
            .take(1)
            .catch(this.notificationsService.deleteError().entity('entities.contractors.gen.singular').callback());
  }

  readManagersForContractor(contractorId: number): Observable<any> {
    return this.dataService.readAll('/contractors/{contractorId}/managers', { contractorId })
      .catch(this.notificationsService.fetchError().entity('entities.managers.gen.plural').callback());
  }

  selectManager(contractorId: number, managerId: number): void {
    this.dispatch(ContractorsAndPortfoliosService.MANAGER_SELECT, {
       [contractorId]: managerId
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
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio)
      .catch(this.notificationsService.error('errors.default.move').entity('entities.portfolios.gen.singular').callback());
  }

  portfolioMapping: INumberMap;

  deletePortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService
      .delete('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
      .catch(this.notificationsService.deleteError().entity('entities.portfolios.entity.singular').callback());
  }

  selectPortfolio(portfolioId: number): void {
    this.dispatch(
      ContractorsAndPortfoliosService.PORTFOLIO_SELECT,
      { selectedPortfolioId: portfolioId }
    );
  }

  get state(): Observable<IContractorsAndPortfoliosState> {
    return this.store.select(state => state.contractorsAndPortfolios);
  }

  private dispatch(type: string, payload?: any): void {
    this.store.dispatch({ type, payload });
  }
}
