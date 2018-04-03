import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IMassEmail } from './email.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class EmailService {
  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(idData: IGridActionPayload, personRole: number, email: IMassEmail): Observable<void> {
    return this.dataService
      .create('/mass/emails/form', {},
        {
          idData: this.actionGridService.buildRequest(idData),
          actionData: { ...email, personRole }
        }
      )
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationsService.info('system.notifications.tasks.start.success').response(response).dispatch();
          } else {
            this.notificationsService.warning('system.notifications.tasks.start.error').response(response).dispatch();
          }
        }),
        catchError(this.notificationsService.updateError().entity('entities.email.gen.plural').dispatchCallback()),
      );
  }
}
