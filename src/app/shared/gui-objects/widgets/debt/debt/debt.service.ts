import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebt, IDebtNextCall } from './debt.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class DebtService {
  static MESSAGE_DEBT_SELECTED = 'MESSAGE_DEBT_SELECTED';

  baseUrl = '/persons/{personId}/debts';
  extUrl = `${this.baseUrl}/{debtId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IDebt>> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { personId, debtId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { personId }, debt)
      .catch(this.notificationsService.createError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  update(personId: number, debtId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .update(this.extUrl, { debtId, personId }, debt)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  changeStatus(personId: number, debtId: number, debt: Partial<IDebt>): Observable<void> {
    return this.dataService
      .update(`${this.extUrl}/statuschange`, { debtId, personId }, debt)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  setNextCallDate(debtId: number, call: IDebtNextCall): Observable<void> {
    return this.dataService
      .update('/debts/{debtId}/nextCall', { debtId }, call)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
    }
}
