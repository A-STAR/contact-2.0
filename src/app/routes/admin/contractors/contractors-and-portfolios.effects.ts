import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IContractorsResponse } from './contractors-and-portfolios.interface';

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
          // TODO(d.maltsev): i18n
          this.notificationsService.createErrorAction('contractors.messages.errors.fetch')
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
    // return this.dataService.read('/api/banks');
  }
}
