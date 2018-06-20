import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DebtorCardLayoutService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  closeCard(debtId: number): Observable<void> {
    return this.dataService.create('/debt/{debtId}/closeCard', { debtId }, {})
      .pipe(
        catchError(this.notificationsService.error('debt.close.error').dispatchCallback()),
      );
  }
}
