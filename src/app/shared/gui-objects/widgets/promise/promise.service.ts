import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPromise } from './promise.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PromiseService {
  static MESSAGE_PROMISE_SAVED = 'MESSAGE_PROMISE_SAVED';

  private baseUrl = '/debts/{debtId}/promises';
  private extUrl = `${this.baseUrl}/promiseId`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<IPromise[]> {
    return this.dataService
      .read(this.baseUrl, { debtId })
      .map(resp => resp.promises)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, promiseId: number): Observable<IPromise> {
    return this.dataService
      .read(this.extUrl, { debtId, promiseId })
      .map(resp => resp.promises[0] || {})
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employment.gen.singular').dispatchCallback());
  }

  create(debtId: number, promise: IPromise): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, promise)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.employment.gen.singular').dispatchCallback());
  }

  update(debtId: number, promiseId: number, promise: IPromise): Observable<any> {
    return this.dataService
      .update(this.extUrl, { debtId, promiseId }, promise)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employment.gen.singular').dispatchCallback());
  }

  delete(debtId: number, promiseId: number): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { debtId, promiseId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.employment.gen.singular').dispatchCallback());
  }
}
