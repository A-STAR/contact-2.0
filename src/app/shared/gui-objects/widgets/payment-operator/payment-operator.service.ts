import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PaymentOperatorService {
  private url = '/mass/payments';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  confirm(paymentIds: number[]): Observable<any> {
    return this.dataService
      .update(`${this.url}/confirmOperator`, {}, { idData: { ids: paymentIds } })
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.plural').dispatchCallback());
  }

  reject(paymentIds: number[]): Observable<any> {
    return this.dataService
      .update(`${this.url}/cancelOperator`, {}, { idData: { ids: paymentIds } })
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.plural').dispatchCallback());
  }
}
