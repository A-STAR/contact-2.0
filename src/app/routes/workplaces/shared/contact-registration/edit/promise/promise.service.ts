import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPromise } from './promise.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PromiseService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(debtId: number, guid: string, promise: IPromise): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/promise', { debtId, guid }, promise)
      .catch(this.notificationsService.createError().entity('entities.promises.gen.singular').dispatchCallback());
  }
}
