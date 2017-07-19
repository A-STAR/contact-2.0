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
        .catch(this.notificationsService.error('errors.default.read').entity('debtors.entity.singular').callback());
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
        .catch(this.notificationsService.error('errors.default.read').entity('debtors.info.entity.plural').callback());
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
        .catch(this.notificationsService.error('errors.default.read').entity('debtors.phones.entity.plural').callback());
    });

  constructor(
    private actions: Actions,
    private notificationsService: NotificationsService,
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
              lastName: 'Smirnov',
              type: 1,
              responsible: 'System administrator',
              reward: '3180.78'
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
              birthDate: new Date('01.01.1980'),
              company: 'Financial and Investment Group',
              sex: 1,
              workplaceChecked: 1,
              importance: 4,
              stage: 1,
              decency: 10,
              maritalStatus: 2,
              education: 3,
              series: '45 06',
              number: '280499',
              issueDate: new Date('01.01.2000'),
              position: 'Senior Consultant',
              issuedBy: 'Passport office No 122',
              email: 'p.smirnov@gmail.com',
              citizenship: 'Russia',
              income: 23000.11
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
                  type: 1,
                  number: '8-495-000-342',
                  status: 1,
                  comment: 'Has been imported by data loader',
                  active: 1,
                  numberExists: 1,
                  verified: 1
                },
                {
                  type: 2,
                  number: '8-495-889-165',
                  status: 1,
                  comment: 'Has been imported by data loader',
                  active: 1,
                  numberExists: 1,
                  verified: 1
                },
                {
                  type: 3,
                  number: '8-964-5638-890',
                  status: 1,
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
