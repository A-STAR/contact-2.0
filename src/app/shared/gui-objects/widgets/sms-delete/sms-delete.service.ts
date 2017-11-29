import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class SmsDeleteService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/mass/sms/delete';

  smsDelete(ids: number[]): Observable<any> {
    return this.dataService.update(this.url, {}, { idData: { ids } } )
      .do(res => {
        if (!res.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        } else {
          // check for 0 successful deletions
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.deleteError().entity('entities.sms.gen.plural').dispatchCallback());
   }
}
