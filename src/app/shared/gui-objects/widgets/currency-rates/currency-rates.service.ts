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
    return this.dataService.readAll(this.baseUrl, { currencyId })
      .catch(this.notificationsService.fetchError().entity('entities.currencyRates.gen.plural').dispatchCallback());
  }

  fetch(currencyId: number, currencyRateId: number): Observable<ICurrencyRate> {
    return this.dataService.read(`${this.baseUrl}/{currencyRateId}`, { currencyId, currencyRateId })
      .catch(this.notificationsService.fetchError().entity('entities.currencyRates.gen.singular').dispatchCallback());
  }

  create(currencyId: number, currencyRate: ICurrencyRate): Observable<ICurrencyRate> {
    return this.dataService.create(`${this.baseUrl}/{currencyRateId}`, { currencyId }, currencyRate)
      .catch(this.notificationsService.createError().entity('entities.currencyRates.gen.singular').dispatchCallback());
  }

  update(currencyId: number, currencyRateId: number, currencyRate: ICurrencyRate): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{currencyRateId}`, { currencyId, currencyRateId }, currencyRate)
      .catch(this.notificationsService.updateError().entity('entities.currencyRates.gen.singular').dispatchCallback());
  }
}
