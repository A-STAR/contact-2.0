import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPayment } from './payment.interface';
import { IDebt } from '../debt/debt/debt.interface';

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

  fetchAll(debtId: number, displayCanceled: boolean = false): Observable<IPayment[]> {
    const url = !displayCanceled ? `${this.baseUrl}?isCanceled=0` : this.baseUrl;
    return this.dataService
      .read(url, { debtId })
      .map(resp => resp.payments)
      .catch(this.notificationsService.fetchError().entity('entities.payments.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, paymentId: number): Observable<IPayment> {
    return this.dataService
      .read(this.extUrl, { debtId, paymentId })
      .map(resp => resp.payments[0] || {})
      .catch(this.notificationsService.fetchError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  create(debtId: number, payment: IPayment): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, payment)
      .catch(this.notificationsService.createError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  update(debtId: number, paymentId: number, payment: IPayment): Observable<any> {
    return this.dataService
      .update(this.extUrl, { debtId, paymentId }, payment)
      .catch(this.notificationsService.updateError().entity('entities.payments.gen.singular').dispatchCallback());
  }

  fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .map(result => result.debts[0] || {})
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
