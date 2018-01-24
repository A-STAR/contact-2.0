import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';

import { IPromiseLimit } from './promise.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PromiseService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  getLimit(debtId: number, callCenter: boolean): Observable<IPromiseLimit> {
    return this.dataService
      .read('/debts/{debtId}/promiseslimit', { debtId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.promisesLimit.gen.singular').dispatchCallback()),
      );
  }
}
