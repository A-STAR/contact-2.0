import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, first, map } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import {
  IContractor,
  IContractorsAndPortfoliosState,
  IContractorManager,
  IPortfolio,
  IPortfolioMoveRequest,
  IPortfolioOutsourceRequest,
  IActionType,
  IContractorAndPorfolioAction
} from './contractors-and-portfolios.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContractorsAndPortfoliosService {

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  readAllContractors(): Observable<IContractor[]> {
    return this.dataService
      .readAll('/contractors')
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.contractors.gen.plural').dispatchCallback())
      );
  }

  readAllContractorsExeptCurrent(currentContractorId: number): Observable<IContractor[]> {
    return this.readAllContractors()
      .pipe(
        map(contractors => contractors.filter(contractor => contractor.id !== currentContractorId)),
        catchError(this.notificationsService.fetchError().entity('entities.contractors.gen.plural').dispatchCallback()),
      );
  }

  readContractor(contractorId: number): Observable<IContractor> {
    return this.dataService
      .read('/contractors/{contractorId}', { contractorId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.contractors.gen.singular').dispatchCallback()),
      );
  }

  selectContractor(contractor: IContractor): void {
    this.dispatch(IActionType.CONTRACTOR_SELECT, { selectedContractor: contractor });
  }

  createContractor(contractor: IContractor): Observable<void> {
    return this.dataService
      .create('/contractors', {}, contractor)
      .pipe(
        catchError(this.notificationsService.createError().entity('entities.contractors.gen.singular').dispatchCallback()),
      );
  }

  updateContractor(contractorId: number, contractor: IContractor): Observable<void> {
    return this.dataService
      .update('/contractors/{contractorId}', { contractorId }, contractor)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.contractors.gen.singular').dispatchCallback()),
      );
  }

  deleteContractor(contractorId: Number): Observable<any> {
    return this.dataService
      .delete('/contractors/{contractorId}', { contractorId })
      .pipe(
        first(),
        catchError(this.notificationsService.deleteError().entity('entities.contractors.gen.singular').dispatchCallback()),
      );
  }

  readManagersForContractor(contractorId: number): Observable<any> {
    return this.dataService
      .readAll('/contractors/{contractorId}/managers', { contractorId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.managers.gen.plural').dispatchCallback()),
      );
  }

  selectManager(manager?: IContractorManager): void {
    this.dispatch(IActionType.MANAGER_SELECT, {
       selectedManager: manager
    });
  }

  readManager(contractorId: number, managerId: number): Observable<any> {
    return this.dataService
      .read('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.managers.gen.singular').dispatchCallback()),
      );
  }

  createManager(contractorId: number, manager: IContractorManager): Observable<any> {
    return this.dataService
      .create('/contractors/{contractorId}/managers', { contractorId }, manager)
      .pipe(
        catchError(this.notificationsService.createError().entity('entities.managers.gen.singular').dispatchCallback()),
      );
  }

  updateManager(contractorId: number, managerId: number, manager: IContractorManager): Observable<any> {
    return this.dataService
      .update('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId }, manager)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback()),
      );
  }

  deleteManager(contractorId: number, managerId: number): Observable<any> {
    return this.dataService
      .delete('/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId })
      .pipe(
        catchError(this.notificationsService.deleteError().entity('entities.managers.gen.singular').dispatchCallback()),
      );
  }

  readPortfolios(contractorId: Number): Observable<any> {
    return this.dataService
      .readAll('/contractors/{contractorId}/portfolios', { contractorId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.portfolios.gen.plural').dispatchCallback()),
      );
  }

  readPortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService
      .read('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.contractors.gen.singular').dispatchCallback()),
      );
  }

  createPortfolio(contractorId: number, portfolio: IPortfolio): Observable<any> {
    return this.dataService
      .create('/contractors/{contractorId}/portfolios', { contractorId }, { ...portfolio, stageCode: 1 })
      .pipe(
        catchError(this.notificationsService.createError().entity('entities.portfolios.gen.singular').dispatchCallback())
      );
  }

  updatePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioMoveRequest,
  ): Observable<any> {
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').dispatchCallback()),
      );
  }

  movePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioMoveRequest,
  ): Observable<any>  {
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio)
      .pipe(
        catchError(
          this.notificationsService.error('errors.default.move').entity('entities.portfolios.gen.singular').dispatchCallback(),
        ),
      );
  }

  deletePortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService
      .delete('/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId })
      .pipe(
        catchError(this.notificationsService.deleteError().entity('entities.portfolios.entity.singular').dispatchCallback()),
      );
  }

  formOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio,
  ): Observable<any> {
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/form', { contractorId, portfolioId }, portfolio)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').dispatchCallback()),
      );
  }

  sendOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest,
  ): Observable<any> {
    const data = { ...portfolio, debtStatusCode: 14 };
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/send', { contractorId, portfolioId }, data)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').dispatchCallback()),
      );
  }

  sendCessionPortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest,
  ): Observable<any> {
    const data = { ...portfolio, debtStatusCode: 17 };
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/send', { contractorId, portfolioId }, data)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').dispatchCallback()),
      );
  }

  returnOutsourcePortfolio(
    contractorId: number,
    portfolioId: number,
    portfolio: IPortfolio | IPortfolioOutsourceRequest,
  ): Observable<any> {
    return this.dataService
      .update('/contractors/{contractorId}/portfolios/{portfolioId}/outsourcing/return', { contractorId, portfolioId }, portfolio)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.portfolios.gen.singular').dispatchCallback()),
      );
  }

  selectPortfolio(portfolio?: IPortfolio): void {
    this.dispatch(
      IActionType.PORTFOLIO_SELECT,
      { selectedPortfolio: portfolio }
    );
  }

  get state(): Observable<IContractorsAndPortfoliosState> {
    return this.store.pipe(
      select(state => state.contractorsAndPortfolios),
    );
  }

  dispatch(type: IActionType, payload?: any): void {
    this.store.dispatch({ type, payload });
  }

  getAction(action: IActionType): Observable<IContractorAndPorfolioAction> {
    return this.actions$.ofType(action);
  }
}
