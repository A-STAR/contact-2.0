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

  private deleteUrl = '/mass/sms/delete';

  smsDelete(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.deleteUrl, {}, { idData: { ids } } )
        .do(res => {
          if (!res.success) {
            // TODO make dict when its will be fixed
            this.notificationsService.error('errors.default.read').entity('entities.user.constants.gen.plural').callback();
            return;
          }
        });
      // TODO unmock when api ready, make dict for catc
      // .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').callback());
   }
}
