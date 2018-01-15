import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IMassEmail } from './email.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class EmailService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(debtIds: number[], personIds: number[], personRole: number, email: IMassEmail): Observable<void> {
    const idData = debtIds.map((debtId, i) => [ debtId, personIds[i] ]);
    return this.dataService
      .update('/mass/emails/form', {}, { ...email, idData, personRole })
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
          } else {
            this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
          }
        }),
        catchError(this.notificationsService.updateError().entity('entities.email.gen.plural').dispatchCallback()),
      );
  }
}
