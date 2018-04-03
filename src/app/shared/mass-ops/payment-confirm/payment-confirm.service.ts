import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';

@Injectable()
export class PaymentConfirmService {
  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private confirmUrl = '/mass/payments/confirm';
  private cancelUrl = '/mass/payments/cancel';

  paymentsConfirm(idData: IGridActionPayload): Observable<any> {
    return this.dataService.update(this.confirmUrl, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .do(response => {
        if (response.success) {
          this.notificationsService.info('system.notifications.tasks.start.success').response(response).dispatch();
        } else {
          this.notificationsService.warning('system.notifications.tasks.start.error').response(response).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }

  paymentsCancel(idData: IGridActionPayload): Observable<any> {
    return this.dataService.update(this.cancelUrl, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .do(response => {
        if (response.success) {
          this.notificationsService.info('system.notifications.tasks.start.success').response(response).dispatch();
        } else {
          this.notificationsService.warning('system.notifications.tasks.start.error').response(response).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }

  getPaymentsCount(idData: IGridActionPayload): number | string {
    // NOTE: empty string is passed, when we ask for payments by filter,
    // because we do not know yet how many we will confirm or cancel
    return this.actionGridService.getSelectionCount(idData) || '';
  }

}
