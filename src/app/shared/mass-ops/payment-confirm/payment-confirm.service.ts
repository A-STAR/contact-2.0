import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Injectable()
export class PaymentConfirmService {
  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private confirmUrl = '/mass/payments/confirm';
  private cancelUrl = '/mass/payments/cancel';

  paymentsConfirm(idData: IGridActionPayload): Observable<any> {
    return this.dataService.update(this.confirmUrl, {},
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
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }

  paymentsCancel(idData: IGridActionPayload): Observable<any> {
    return this.dataService.update(this.cancelUrl, {},
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
      .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').dispatchCallback());
  }

  getPaymentsCount(idData: IGridActionPayload): number | string {
    // NOTE: empty string is passed, when we ask for payments by filter,
    // because we do not know yet how many we will confirm or cancel
    return this.actionGridFilterService.getSelectionCount(idData) || '';
  }

}
