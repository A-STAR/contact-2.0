import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IPromise, IPromiseLimit } from './promise.interface';
import { Debt } from '@app/entities';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PromiseService extends AbstractActionService {
  static MESSAGE_PROMISE_SAVED = 'MESSAGE_PROMISE_SAVED';
  static MESSAGE_DEBT_SELECTED = 'MESSAGE_DEBT_SELECTED';

  private baseUrl = '/debts/{debtId}/promises';
  private extUrl = `${this.baseUrl}/{promiseId}`;

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(debtId: number, callCenter: boolean): Observable<IPromise[]> {
    return this.dataService
      .readAll(this.baseUrl, { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.promises.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, promiseId: number, callCenter: boolean): Observable<IPromise> {
    return this.dataService
      .read(this.extUrl, { debtId, promiseId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  create(debtId: number, promise: IPromise, callCenter: boolean): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, promise, { params: { callCenter } })
      .catch(this.notificationsService.createError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  update(debtId: number, promiseId: number, promise: IPromise, callCenter: boolean): Observable<any> {
    return this.dataService
      .update(this.extUrl, { debtId, promiseId }, promise, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  delete(debtId: number, promiseId: number, callCenter: boolean): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { debtId, promiseId }, { params: { callCenter } })
      .catch(this.notificationsService.deleteError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  /**
   * @deprecated
   * Use `workplaces/core/promise` instead
   */
  getPromiseLimit(debtId: number, callCenter: boolean): Observable<IPromiseLimit> {
    return this.dataService
      .read('/debts/{debtId}/promiseslimit', { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.promisesLimit.gen.plural').dispatchCallback());
  }

  fetchDebt(debtId: number, callCenter: boolean): Observable<Debt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
