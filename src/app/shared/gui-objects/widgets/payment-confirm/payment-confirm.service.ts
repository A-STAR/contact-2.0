import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PaymentConfirmService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private confirmUrl = '/mass/payments/confirm';
  private cancelUrl = '/mass/payments/cancel';

  paymentsConfirm(payments: number[]): Observable<any> {
    const ids = payments.map(id => [ id ]);
    return this.dataService.update(this.confirmUrl, {}, { idData: { ids } } )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }

  paymentsCancel(payments: number[]): Observable<any> {
    const ids = payments.map(id => [ id ]);
    return this.dataService.update(this.cancelUrl, {}, { idData: { ids } } )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }
}
