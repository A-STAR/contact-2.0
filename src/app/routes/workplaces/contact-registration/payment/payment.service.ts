import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPayment } from './payment.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class PaymentService {
  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, payment: IPayment): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/payment', { debtId, guid }, payment);
  }
}
