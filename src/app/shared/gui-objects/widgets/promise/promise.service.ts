import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPromise, IPromiseLimit } from './promise.interface';
import { IDebt } from '../debt/debt/debt.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PromiseService {
  static MESSAGE_PROMISE_SAVED = 'MESSAGE_PROMISE_SAVED';
  static MESSAGE_DEBT_SELECTED = 'MESSAGE_DEBT_SELECTED';

  private baseUrl = '/debts/{debtId}/promises';
  private extUrl = `${this.baseUrl}/{promiseId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<IPromise[]> {
    return this.dataService
      .read(this.baseUrl, { debtId })
      .map(resp => resp.promises)
      .catch(this.notificationsService.fetchError().entity('entities.promises.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, promiseId: number): Observable<IPromise> {
    return this.dataService
      .read(this.extUrl, { debtId, promiseId })
      .map(resp => resp.promises[0] || {})
      .catch(this.notificationsService.fetchError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  create(debtId: number, promise: IPromise): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, promise)
      .catch(this.notificationsService.createError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  update(debtId: number, promiseId: number, promise: IPromise): Observable<any> {
    return this.dataService
      .update(this.extUrl, { debtId, promiseId }, promise)
      .catch(this.notificationsService.updateError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  delete(debtId: number, promiseId: number): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { debtId, promiseId })
      .catch(this.notificationsService.deleteError().entity('entities.promises.gen.singular').dispatchCallback());
  }

  getPromiseLimit(debtId: number): Observable<IPromiseLimit> {
    return this.dataService
      .read('/debts/{debtId}/promiseslimit', { debtId })
      .catch(this.notificationsService.fetchError().entity('entities.promises.gen.plural').dispatchCallback());
  }

  fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .map(result => result.debts[0] || {})
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
