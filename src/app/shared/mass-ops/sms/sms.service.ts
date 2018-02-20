import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IMassSms } from './sms.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class SmsService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(debtIds: number[], personIds: number[], personRole: number, sms: IMassSms): Observable<void> {
    const ids = debtIds.map((debtId, i) => [ debtId, personIds[i] ]);
    return this.dataService
      .create('/mass/sms/form', {}, { actionData: { ...sms, personRole }, idData: { ids } })
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
