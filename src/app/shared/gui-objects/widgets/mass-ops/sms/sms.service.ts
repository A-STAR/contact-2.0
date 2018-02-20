import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IMassSms } from './sms.interface';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class SmsService {
  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(idData: IGridActionPayload, personRole: number, sms: IMassSms): Observable<void> {
    return this.dataService
      .create('/mass/sms/form', {},
        {
         idData: this.actionGridFilterService.buildRequest(idData),
         actionData: {
           ...sms,
           personRole
          }
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
        catchError(this.notificationsService.updateError().entity('entities.sms.gen.plural').dispatchCallback()),
      );
  }
}
