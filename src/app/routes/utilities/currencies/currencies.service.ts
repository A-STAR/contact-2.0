import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IEntityTranslation } from '@app/core/entity/translations/entity-translations.interface';
import { ICurrency } from './currencies.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { EntityTranslationsService } from '@app/core/entity/translations/entity-translations.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class CurrenciesService extends AbstractActionService {
  static MESSAGE_CURRENCY_SAVED = 'MESSAGE_CURRENCY_SAVED';
  static MESSAGE_CURRENCY_SELECTED = 'MESSAGE_CURRENCY_SELECTED';

  static CURRENCY_NAME_ID = 162;
  static CURRENCY_SHORT_NAME_ID = 163;

  private baseUrl = '/currencies';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private entityTranslationsService: EntityTranslationsService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_EDIT');
  }

  canDelete$(currency: ICurrency): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_DELETE').map(canDelete => canDelete && currency && !currency.isMain);
  }

  fetchAll(): Observable<Array<ICurrency>> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.currencies.gen.plural').dispatchCallback());
  }

  fetch(currencyId: number): Observable<ICurrency> {
    return this.dataService.read(`${this.baseUrl}/{currencyId}`, { currencyId })
      .catch(this.notificationsService.fetchError().entity('entities.currencies.gen.singular').dispatchCallback());
  }

  create(currency: ICurrency): Observable<ICurrency> {
    return this.dataService.create(this.baseUrl, {}, currency)
      .catch(this.notificationsService.createError().entity('entities.currencies.gen.singular').dispatchCallback());
  }

  update(currencyId: number, currency: ICurrency): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{currencyId}`, { currencyId }, currency)
      .catch(this.notificationsService.updateError().entity('entities.currencies.gen.singular').dispatchCallback());
  }

  delete(currencyId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{currencyId}`, { currencyId })
      .catch(this.notificationsService.deleteError().entity('entities.currencies.gen.singular').dispatchCallback());
  }

  readCurrencyNameTranslations(currencyId: number): Observable<IEntityTranslation[]> {
    return this.entityTranslationsService.readTranslations(currencyId, CurrenciesService.CURRENCY_NAME_ID);
  }

  readCurrencyShortNameTranslations(currencyId: number): Observable<IEntityTranslation[]> {
    return this.entityTranslationsService.readTranslations(currencyId, CurrenciesService.CURRENCY_SHORT_NAME_ID);
  }
}
