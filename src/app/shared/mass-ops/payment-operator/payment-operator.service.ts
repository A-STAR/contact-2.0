import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PaymentOperatorService {
  private url = '/mass/payments';

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  confirm(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/confirmOperator`, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.plural').dispatchCallback());
  }

  reject(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/cancelOperator`, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.plural').dispatchCallback());
  }
}
