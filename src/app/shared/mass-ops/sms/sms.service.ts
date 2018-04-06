import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IMassSms } from './sms.interface';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SmsService {
  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  schedule(idData: IGridActionPayload, personRole: number, sms: IMassSms): Observable<void> {
    return this.dataService
      .create('/mass/sms/form', {},
        {
         idData: this.actionGridService.buildRequest(idData),
         actionData: {
           ...sms,
           personRole
          }
        }
      )
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.sms.gen.plural').dispatchCallback()),
      );
  }
}
