import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IAppState } from '../../../core/state/state.interface';
import {
  IContractor,
  IContractorsAndPortfoliosState,
  IContractorManager,
  IPortfolio,
  IPortfolioMoveRequest,
  IPortfolioOutsourceRequest,
  IActionType,
  IContractorAndPorfolioAction,
  IPortfolioDetailsArgs,
  IContractorDetailsArgs,
} from './contractors-and-portfolios.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ContractorsAndPortfoliosService {

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  readAllContractors(): Observable<IContractor[]> {
    return <Observable<IContractor[]>>this.dataService.readAll('/contractors')
      .catch(
        this.notificationsService.fetchError().entity('entities.contractors.gen.plural').callback()
      );
  }

  readAllContractorsExeptCurrent(currentContractorId: number): Observable<IContractor[]> {
    return <Observable<IContractor[]>>this.readAllContractors()
      .map(contractors => contractors.filter(contractor => contractor.id !== currentContractorId))
      .catch(
        this.notificationsService.fetchError().entity('entities.contractors.gen.plural').callback()
      );
  }

  readContractor(contractorId: number): Observable<IContractor> {
    return this.dataService.read('/contractors/{contractorId}', { contractorId })
      .catch(this.notificationsService.fetchError().entity('entities.contractors.gen.singular').callback());
  }

  selectContractor(contractor: IContractor): void {
    this.dispatch(IActionType.CONTRACTOR_SELECT, { selectedContractor: contractor });
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
            .pipe(first())
            .catch(this.notificationsService.deleteError().entity('entities.contractors.gen.singular').callback());
  }

  readManagersForContractor(contractorId: number): Observable<any> {
    return this.dataService.readAll('/contractors/{contractorId}/managers', { contractorId })
      .catch(this.notificationsService.fetchError().entity('entities.managers.gen.plural').callback());
  }

  selectManager(manager?: IContractorManager): void {
    this.dispatch(IActionType.MANAGER_SELECT, {
       selectedManager: manager
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

  deletePortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService
      .delete('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
      .catch(this.notificationsService.deleteError().entity('entities.portfolios.entity.singular').callback());
  }

  formOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio): Observable<any> {
    return this.dataService.update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/form', {
      contractorId, portfolioId
    }, portfolio)
    .catch(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').callback());
  }

  sendOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest): Observable<any> {
    return this.dataService.update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/send', {
      contractorId, portfolioId
    }, { ...portfolio, debtStatusCode: 14 })
      .catch(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').callback());
  }

  sendCessionPortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest): Observable<any> {
    return this.dataService.update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/send', {
      contractorId, portfolioId
    }, { ...portfolio, debtStatusCode: 17 })
      .catch(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').callback());
  }


  returnOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest): Observable<any> {
    return this.dataService.update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/return', {
      contractorId, portfolioId
    }, portfolio)
      .catch(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').callback());
  }

  selectPortfolio(portfolio?: IPortfolio): void {
    this.dispatch(
      IActionType.PORTFOLIO_SELECT,
      { selectedPortfolio: portfolio }
    );
  }

  get state(): Observable<IContractorsAndPortfoliosState> {
    return this.store.select(state => state.contractorsAndPortfolios);
  }

  dispatch(type: IActionType, payload?: any): void {
    this.store.dispatch({ type, payload });
  }

  getAction(action: IActionType): Observable<IContractorAndPorfolioAction> {
    return this.actions$.ofType(action);
  }
}
