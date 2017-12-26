import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { ICurrencyRate } from './currency-rates.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class CurrencyRatesService extends AbstractActionService {
  static MESSAGE_CURRENCY_RATE_SAVED = 'MESSAGE_CURRENCY_RATE_SAVED';

  private baseUrl = '/currencies/{currencyId}/rates';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_RATES_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_RATES_EDIT');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_RATES_EDIT');
  }

  fetchAll(currencyId: number): Observable<Array<ICurrencyRate>> {
    // return this.dataService.readAll(this.baseUrl, { currencyId })
      // .catch(this.notificationsService.fetchError().entity('entities.currencyRates.gen.plural').dispatchCallback());
    return Observable.of([
      { id: 1, fromDateTime: '2017-08-07T21:00:00Z', rate: 1.231 }
    ]);
  }

  fetch(currencyId: number, currencyRateId: number): Observable<ICurrencyRate> {
    // return this.dataService.read(`${this.baseUrl}/{currencyRateId}`, { currencyId, currencyRateId })
      // .catch(this.notificationsService.fetchError().entity('entities.currencyRates.gen.singular').dispatchCallback());
    return Observable.of({ id: 1, fromDateTime: '2017-08-07T21:00:00Z', rate: 1.231 });
  }

  create(currencyId: number, currencyRate: ICurrencyRate): Observable<ICurrencyRate> {
    return this.dataService.update(this.baseUrl, { currencyId }, currencyRate)
      .catch(this.notificationsService.createError().entity('entities.currencyRates.gen.singular').dispatchCallback());
  }

  update(currencyId: number, currencyRate: ICurrencyRate): Observable<any> {
    return this.dataService.update(this.baseUrl, { currencyId }, currencyRate)
      .catch(this.notificationsService.updateError().entity('entities.currencyRates.gen.singular').dispatchCallback());
  }
}
