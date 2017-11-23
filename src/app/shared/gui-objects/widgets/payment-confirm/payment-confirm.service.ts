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


  paymentsConfirm(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.confirmUrl, {}, { idData: { ids } } )
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

   paymentsCancel(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.cancelUrl, {}, { idData: { ids } } )
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
