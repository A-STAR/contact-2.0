import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPayment } from './payment.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PaymentService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(debtId: number, guid: string, payment: IPayment): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/payment', { debtId, guid }, payment)
      .catch(this.notificationsService.createError().entity('entities.payments.gen.singular').dispatchCallback());
  }
}
