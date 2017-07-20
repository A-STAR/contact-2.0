import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import {
  IContractor,
  IContractorsResponse,
  IContractorManager,
  IContractorManagersResponse,
  IPortfolio,
  IPortfolioMoveRequest,
  IPortfoliosResponse
} from './contractors-and-portfolios.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';
import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ContractorsAndPortfoliosEffects {
  @Effect()
  fetchContractors$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTORS_FETCH)
    .switchMap((action: Action) => {
      return this.readContractors()
        .map(response => ({
          type: ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS,
          payload: {
            contractors: response.contractors
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.contractors.gen.plural').callback());
    });

  @Effect()
  fetchContractor$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTOR_FETCH)
    .switchMap((action: Action) => {
      return this.readContractor(action.payload.contractorId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.CONTRACTOR_FETCH_SUCCESS,
          payload: {
            contractor: response.contractors[0]
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.contractors.gen.singular').callback());
    });

  @Effect()
  createContractor$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTOR_CREATE)
    .switchMap((action: Action) => {
      return this.createContractor(action.payload.contractor)
        .map(() => ({
          type: ContractorsAndPortfoliosService.CONTRACTOR_CREATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.create').entity('entities.contractors.gen.singular').callback());
    });

  @Effect()
  updateContractor$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTOR_UPDATE)
    .switchMap((action: Action) => {
      const { contractor, contractorId } = action.payload;
      return this.updateContractor(contractorId, contractor)
        .map(() => ({
          type: ContractorsAndPortfoliosService.CONTRACTOR_UPDATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.update').entity('entities.contractors.gen.singular').callback());
    });

  @Effect()
  deleteContractor$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTOR_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteContractor(store.contractorsAndPortfolios.selectedContractorId)
        .mergeMap(() => [
          { type: ContractorsAndPortfoliosService.CONTRACTORS_FETCH },
          { type: ContractorsAndPortfoliosService.CONTRACTOR_DELETE_SUCCESS }
        ])
        .catch(this.notificationsService.error('errors.default.delete').entity('entities.contractors.gen.singular').callback());
    });

  @Effect()
  fetchManagers$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGERS_FETCH)
    .switchMap((action: Action) => {
      return this.readManagers(action.payload.contractorId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.MANAGERS_FETCH_SUCCESS,
          payload: {
            managers: response.managers
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.managers.gen.plural').callback());
    });

  @Effect()
  fetchManager$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGER_FETCH)
    .switchMap((action: Action) => {
      return this.readManager(action.payload.contractorId, action.payload.managerId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.MANAGER_FETCH_SUCCESS,
          payload: {
            manager: response.managers[0]
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.managers.gen.singular').callback());
    });

  @Effect()
  createManager$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGER_CREATE)
    .switchMap((action: Action) => {
      const { contractorId, manager } = action.payload;
      return this.createManager(contractorId, manager)
        .map(() => ({
          type: ContractorsAndPortfoliosService.MANAGER_CREATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.create').entity('entities.managers.gen.singular').callback());
    });

  @Effect()
  updateManager$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGER_UPDATE)
    .switchMap((action: Action) => {
      const { contractorId, managerId, manager } = action.payload;
      return this.updateManager(contractorId, managerId, manager)
        .map(() => ({
          type: ContractorsAndPortfoliosService.MANAGER_UPDATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.update').entity('entities.managers.gen.singular').callback());
    });

  @Effect()
  deleteManager$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGER_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.deleteManager(action.payload.contractorId, store.contractorsAndPortfolios.selectedManagerId)
        .mergeMap(() => [
          { type: ContractorsAndPortfoliosService.MANAGERS_FETCH, payload: action.payload },
          { type: ContractorsAndPortfoliosService.MANAGER_DELETE_SUCCESS }
        ])
        .catch(this.notificationsService.error('errors.default.delete').entity('entities.managers.gen.singular').callback());
    });

  @Effect()
  fetchPortfolios$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readPortfolios(store.contractorsAndPortfolios.selectedContractorId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS,
          payload: {
            portfolios: response.portfolios
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.portfolios.gen.plural').callback());
    });

  @Effect()
  fetchPortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_FETCH)
    .switchMap((action: Action) => {
      const { contractorId, portfolioId } = action.payload;
      return this.readPortfolio(contractorId, portfolioId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS,
          payload: {
            portfolio: response.portfolios[0]
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.portfolios.gen.singular').callback());
    });

  @Effect()
  createPortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_CREATE)
    .switchMap((action: Action) => {
      const { contractorId, portfolio } = action.payload;
      return this.createPortfolio(contractorId, portfolio)
        .map(() => ({
          type: ContractorsAndPortfoliosService.PORTFOLIO_CREATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.create').entity('entities.portfolios.gen.singular').callback());
    });

  @Effect()
  updatePortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_UPDATE)
    .switchMap((action: Action) => {
      const { contractorId, portfolioId, portfolio } = action.payload;
      return this.updatePortfolio(contractorId, portfolioId, portfolio)
        .map(() => ({
          type: ContractorsAndPortfoliosService.PORTFOLIO_UPDATE_SUCCESS
        }))
        .catch(this.notificationsService.error('errors.default.update').entity('entities.portfolios.gen.singular').callback());
    });

  @Effect()
  movePortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_MOVE)
    .switchMap((action: Action) => {
      const { contractorId, newContractorId, portfolioId } = action.payload;
      return this.updatePortfolio(contractorId, portfolioId, { newContractorId })
        .mergeMap(() => [
          { type: ContractorsAndPortfoliosService.PORTFOLIO_MOVE_SUCCESS },
          { type: ContractorsAndPortfoliosService.CONTRACTORS_FETCH }
        ])
        .catch(this.notificationsService.error('errors.default.move').entity('entities.portfolios.gen.singular').callback());
    });

  @Effect()
  deletePortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.deletePortfolio(action.payload.contractorId, store.contractorsAndPortfolios.selectedPortfolioId)
        .mergeMap(() => [
          { type: ContractorsAndPortfoliosService.PORTFOLIOS_FETCH },
          { type: ContractorsAndPortfoliosService.PORTFOLIO_DELETE_SUCCESS }
        ])
        .catch(this.notificationsService.error('errors.default.delete').entity('entities.portfolios.entity.singular').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
  ) {}

  private readContractors(): Observable<IContractorsResponse> {
    return this.dataService.read('/api/contractors');
  }

  private readContractor(contractorId: number): Observable<IContractorsResponse> {
    return this.dataService.read('/api/contractors/{contractorId}', { contractorId });
  }

  private createContractor(contractor: IContractor): Observable<any> {
    return this.dataService.create('/api/contractors', {}, contractor);
  }

  private updateContractor(contractorId: number, contractor: IContractor): Observable<any> {
    return this.dataService.update('/api/contractors/{contractorId}', { contractorId }, contractor);
  }

  private deleteContractor(contractorId: number): Observable<any> {
    return this.dataService.delete('/api/contractors/{contractorId}', { contractorId });
  }

  private readManagers(contractorId: number): Observable<IContractorManagersResponse> {
    return this.dataService.read('/api/contractors/{contractorId}/managers', { contractorId });
  }

  private readManager(contractorId: number, managerId: number): Observable<IContractorManagersResponse> {
    return this.dataService.read('/api/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId });
  }

  private createManager(contractorId: number, manager: IContractorManager): Observable<any> {
    return this.dataService.create('/api/contractors/{contractorId}/managers', { contractorId }, manager);
  }

  private updateManager(contractorId: number, managerId: number, manager: IContractorManager): Observable<any> {
    return this.dataService.update('/api/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId }, manager);
  }

  private deleteManager(contractorId: number, managerId: number): Observable<any> {
    return this.dataService.delete('/api/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId });
  }

  private readPortfolios(contractorId: number): Observable<IPortfoliosResponse> {
    return this.dataService.read('/api/contractors/{contractorId}/portfolios', { contractorId });
  }

  private readPortfolio(contractorId: number, portfolioId: number): Observable<IPortfoliosResponse> {
    return this.dataService.read('/api/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId });
  }

  private createPortfolio(contractorId: number, portfolio: IPortfolio): Observable<any> {
    return this.dataService.create('/api/contractors/{contractorId}/portfolios', { contractorId }, portfolio);
  }

  private updatePortfolio(contractorId: number, portfolioId: number, portfolio: IPortfolio | IPortfolioMoveRequest): Observable<any> {
    return this.dataService.update('/api/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId }, portfolio);
  }

  private deletePortfolio(contractorId: number, portfolioId: number): Observable<any> {
    return this.dataService.delete('/api/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId });
  }
}
