import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IMassSms } from './sms.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class SmsService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(debtIds: number[], personIds: number[], personRoles: number[], sms: IMassSms): Observable<void> {
    /**
     * This allows for multiple `personRole`'s
     *
     * Example:
     * ```
     * debtIds = [ 1, 2, 3 ]
     * personIds = [ 4, 5, 6 ]
     * personRoles = [ 7, 8 ]
     * idData = [ [ 1, 4, 7 ], [ 1, 4, 8 ], [ 2, 5, 7 ], [ 2, 5, 8 ], [ 3, 6, 7 ], [ 3, 6, 8 ] ]
     * ```
     */
    const idData = personRoles
      .reduce((acc, personRole) => [ ...acc, debtIds.map((debtId, i) => [ debtId, personIds[i], personRole ]) ], []);
    return this.dataService
      .update('/mass/sms/form', {}, { ...sms, idData })
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
          } else {
            this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
          }
        }),
        catchError(this.notificationsService.updateError().entity('entities.sms.gen.plural').dispatchCallback()),
      );
  }
}
