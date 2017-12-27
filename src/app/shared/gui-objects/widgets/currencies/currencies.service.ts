import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { ICurrency } from './currencies.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class CurrenciesService extends AbstractActionService {
  static MESSAGE_CURRENCY_SAVED = 'MESSAGE_CURRENCY_SAVED';

  private baseUrl = '/currencies';

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
    return this.userPermissionsService.has('CURRENCY_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CURRENCY_DELETE');
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
    return this.dataService.delete(`${this.baseUrl}/{groupId}`, { currencyId })
      .catch(this.notificationsService.deleteError().entity('entities.currencies.gen.singular').dispatchCallback());
  }
}
