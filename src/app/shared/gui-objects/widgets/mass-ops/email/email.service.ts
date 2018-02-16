import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IMassEmail } from './email.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class EmailService {
  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(idData: IGridActionPayload, personRole: number, email: IMassEmail): Observable<void> {
    return this.dataService
      .create('/mass/emails/form', {},
        {
          idData: this.actionGridFilterService.buildRequest(idData),
          actionData: { ...email, personRole }
        }
      )
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
