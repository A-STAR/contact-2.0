import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IContractorsResponse, IPortfoliosResponse } from './contractors-and-portfolios.interface';

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
        .catch(() => [
          this.notificationsService.createErrorAction('contractors.messages.errors.fetch')
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
      contractors: [
        {
          id: 1,
          name: 'Fake Contractor',
          fullName: 'Fake Contractor and Sons Ltd.',
          smsName: 'Fake Contractor',
          responsibleName: 'John Smith',
          typeCode: 1,
          phone: '+7 (800) 123-45-67',
          address: '15 Yemen Rd, Yemen',
          comment: 'No comments for you today!'
        }
      ]
    });
    // return this.dataService.read('/api/contractors');
  }

  private readPortfolios(contractorId: number): Observable<IPortfoliosResponse> {
    // TODO(d.maltsev): remove fake API
    return Observable.of({
      success: true,
      portfolios: [
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
      ]
    });
    // return this.dataService.read('/api/contractors/{contractorId}/portfolios', { contractorId });
  }
}
