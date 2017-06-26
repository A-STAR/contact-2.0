import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import {
  IDebtorFetchResponse,
  IDebtorGeneralInformationPhonesResponse,
  IDebtorGeneralInformationResponse
} from './debtor.interface';

import { DebtorService } from './debtor.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class DebtorCardEffects {

  @Effect()
  fetchDebtor$ = this.actions
    .ofType(DebtorService.DEBTOR_FETCH)
    .switchMap((action: Action) => {
      return this.readDebtor(action.payload)
        .map(response => ({
          type: DebtorService.DEBTOR_FETCH_SUCCESS,
          payload: response.debtor
        }))
        .catch(() => {
          this.notificationsService.error('debtors.debtor.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  fetchDebtorGeneralInformation$ = this.actions
    .ofType(DebtorService.DEBTOR_GENERAL_INFORMATION_FETCH)
    .switchMap((action: Action) => {
      return this.readDebtorGeneralInformation(action.payload)
        .map(response => ({
          type: DebtorService.DEBTOR_GENERAL_INFORMATION_FETCH_SUCCESS,
          payload: response.data
        }))
        .catch(() => {
          this.notificationsService.error('debtors.debtor.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  fetchDebtorGeneralInformationPhones$ = this.actions
    .ofType(DebtorService.DEBTOR_GENERAL_INFORMATION_PHONES_FETCH)
    .switchMap((action: Action) => {
      return this.readDebtorGeneralInformationPhones(action.payload)
        .map(response => ({
          type: DebtorService.DEBTOR_GENERAL_INFORMATION_PHONES_FETCH_SUCCESS,
          payload: response.data
        }))
        .catch(() => {
          this.notificationsService.error('debtors.debtor.messages.errors.fetch');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private notificationsService: NotificationsService,
    private gridService: GridService,
  ) {}

  private readDebtor(id: number): Observable<IDebtorFetchResponse> {
    // TODO(a.poterenko) STUB
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          {
            success: true,
            debtor: {
              id: id,
              firstName: 'Pavel',
              middleName: 'Sergeevich',
              lastName: 'Smirnov'
            }
          }
        );
      }, 1000);
    });
  }

  private readDebtorGeneralInformation(id: number): Observable<IDebtorGeneralInformationResponse> {
    // TODO(a.poterenko) STUB
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          {
            success: true,
            data: {
              id: id,
              birthDate: '01/01/1980',
              company: 'ЗАО "Финансово-ивестиционная группа"',
              sex: 1,
              workplaceChecked: 1,
              importance: 4,
              stage: 5,
              decency: 10,
              maritalStatus: 2,
              series: '45 06',
              number: '280499',
              issueDate: '01/01/2000',
              issuedBy: 'Паспортный стол №1'
            }
          }
        );
      }, 2000);
    });
  }

  private readDebtorGeneralInformationPhones(id: number): Observable<IDebtorGeneralInformationPhonesResponse> {
    // TODO(a.poterenko) STUB
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(
          {
            success: true,
            data: {
              id: id,
              data: [
                {
                  type: 3,
                  number: '8-964-5638890',
                  status: 2,
                  comment: 'Has been imported by data loader',
                  active: 1,
                  numberExists: 1,
                  verified: 1
                }
              ]
            }
          }
        );
      }, 500);
    });
  }
}
