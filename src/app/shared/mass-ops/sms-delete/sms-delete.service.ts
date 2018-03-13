import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class SmsDeleteService {
  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/mass/sms/delete';

  smsDelete(idData: IGridActionPayload): Observable<any> {
    return this.dataService.update(this.url, {},
        {
          idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.deleteError().entity('entities.sms.gen.plural').dispatchCallback());
   }

   getSmsCount(idData: IGridActionPayload): number | string {
     // NOTE: empty string is passed, when we ask for sms by filter,
     // because we do not know yet how many we will delete
     return this.actionGridFilterService.getSelectionCount(idData) || '';
   }
}
