import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPayment } from './payment.interface';
import { IDebt } from '../../../../core/debt/debt.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PaymentService {
  static MESSAGE_PAYMENT_SAVED = 'MESSAGE_PAYMENT_SAVED';
  static MESSAGE_DEBT_SELECTED = 'MESSAGE_DEBT_SELECTED';

  private baseUrl = '/debts/{debtId}/payments';
  private extUrl = `${this.baseUrl}/{paymentId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number, displayCanceled: boolean, callCenter: boolean): Observable<IPayment[]> {
    const url = !displayCanceled ? `${this.baseUrl}?isCanceled=0` : this.baseUrl;
    return this.dataService
      .readAll(url, { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.payments.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, paymentId: number, callCenter: boolean): Observable<IPayment> {
    return this.dataService
      .read(this.extUrl, { debtId, paymentId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  create(debtId: number, payment: IPayment, callCenter: boolean): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, payment, { params: { callCenter } })
      .catch(this.notificationsService.createError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  update(debtId: number, paymentId: number, payment: IPayment, callCenter: boolean): Observable<any> {
    return this.dataService
      .update(this.extUrl, { debtId, paymentId }, payment, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  fetchDebt(debtId: number, callCenter: boolean): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
