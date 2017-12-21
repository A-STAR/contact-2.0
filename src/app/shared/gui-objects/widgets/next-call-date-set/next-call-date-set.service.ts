import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class  NextCallDateSetService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/mass/debts/nextCall';

  setNextCall(debts: number[], nextCallDateTime: string): Observable<any> {
    const ids = debts.map(id => [ id ]);
    return this.dataService.update(this.url, {}, { idData: { ids }, actionData: { nextCallDateTime }} )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.nextCallDate.gen.plural').dispatchCallback());
  }

}
