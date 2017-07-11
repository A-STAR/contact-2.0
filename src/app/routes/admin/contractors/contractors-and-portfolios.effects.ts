import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IContractorsResponse, IContractorManagersResponse, IPortfoliosResponse } from './contractors-and-portfolios.interface';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';
import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ContractorsAndPortfoliosEffects {

  private fakeContractors = [
    {
      id: 1,
      name: 'Fake Contractor',
      fullName: 'Fake Contractor and Sons Ltd.',
      smsName: 'Fake Contractor',
      responsibleId: 1,
      responsibleName: 'John Smith',
      typeCode: 1,
      phone: '+7 (800) 123-45-67',
      address: '15 Yemen Rd, Yemen',
      comment: 'No comments for you today!'
    }
  ];

  private fakeManagers = [
    {
      id: 1,
      fullName: 'Jane Karen Smith',
      firstName: 'Jane',
      middleName: 'Karen',
      lastName: 'Smith',
      genderCode: 1,
      position: 'Senior manager',
      branchCode: 1,
      mobPhone: '+7 (800) 765-43-21',
      workPhone: '+7 (800) 999-99-99',
      intPhone: '42',
      workAddress: '',
      comment: 'Hiya! My name is Jane!',
    }
  ];

  private fakePortfolios = [
    {
      id: 1,
      name: 'Fake portfolio',
      statusCode: 4,
      stageCode: 1,
      directionCode: 1,
      signDate: '',
      startWorkDate: '',
      endWorkDate: '',
      comment: 'I am a comment. Good to see you here.',
    }
  ];

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
        .catch(() => [
          this.notificationsService.createErrorAction('contractors.messages.errors.fetch')
        ]);
    });

  @Effect()
  fetchContractor$ = this.actions
    .ofType(ContractorsAndPortfoliosService.CONTRACTOR_FETCH)
    .switchMap((action: Action) => {
      return this.readContractor(action.payload.contractorId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS,
          payload: {
            contractor: response.contractors[0]
          }
        }))
        .catch(() => [
          this.notificationsService.createErrorAction('contractors.messages.errors.fetch')
        ]);
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
        .catch(() => [
          this.notificationsService.createErrorAction('contractors.managers.messages.errors.fetch')
        ]);
    });

  @Effect()
  fetchManager$ = this.actions
    .ofType(ContractorsAndPortfoliosService.MANAGER_FETCH)
    .switchMap((action: Action) => {
      return this.readManager(action.payload.contractorId, action.payload.managerId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.MANAGERS_FETCH_SUCCESS,
          payload: {
            manager: response.managers[0]
          }
        }))
        .catch(() => [
          this.notificationsService.createErrorAction('contractors.managers.messages.errors.fetch')
        ]);
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
        .catch(() => [
          this.notificationsService.createErrorAction('portfolios.messages.errors.fetch')
        ]);
    });

  @Effect()
  fetchPortfolio$ = this.actions
    .ofType(ContractorsAndPortfoliosService.PORTFOLIO_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.readPortfolio(store.contractorsAndPortfolios.selectedContractorId, action.payload.portfolioId)
        .map(response => ({
          type: ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS,
          payload: {
            portfolio: response.portfolios[0]
          }
        }))
        .catch(() => [
          this.notificationsService.createErrorAction('portfolios.messages.errors.fetch')
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
  ) {}

  private readContractors(): Observable<IContractorsResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      contractors: this.fakeContractors
    });
    // return this.dataService.read('/api/contractors');
  }

  private readContractor(contractorId: number): Observable<IContractorsResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      contractors: this.fakeContractors
    });
    // return this.dataService.read('/api/contractor/{contractorId}', { contractorId });
  }

  private readManagers(contractorId: number): Observable<IContractorManagersResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      managers: this.fakeManagers
    });
    // return this.dataService.read('/api/contractors/{contractorId}/managers', { contractorId });
  }

  private readManager(contractorId: number, managerId: number): Observable<IContractorManagersResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      managers: this.fakeManagers
    });
    // return this.dataService.read('/api/contractors/{contractorId}/managers/{managerId}', { contractorId, managerId });
  }

  private readPortfolios(contractorId: number): Observable<IPortfoliosResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      portfolios: this.fakePortfolios
    });
    // return this.dataService.read('/api/contractors/{contractorId}/portfolios', { contractorId });
  }

  private readPortfolio(contractorId: number, portfolioId: number): Observable<IPortfoliosResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      portfolios: this.fakePortfolios
    });
    // return this.dataService.read('/api/contractors/{contractorId}/portfolios/{portfolioId}', { contractorId, portfolioId });
  }
}
