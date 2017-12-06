import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class OpenDebtCardService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/persons/{personsId}/debts';

  getFirstDebtsByUserId(personsId: number): Observable<any> {
    return this.dataService.read(this.url, { personsId } )
      .map(res => res.id)
      .catch(this.notificationsService.deleteError().entity('entities.sms.debts.plural').dispatchCallback());
   }
}
