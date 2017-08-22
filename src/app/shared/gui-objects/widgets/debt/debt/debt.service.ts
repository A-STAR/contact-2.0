import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebt } from './debt.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class DebtService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IDebt>> {
    return this.dataService
      .read('/persons/{personId}/debts', { personId })
      .map(resp => resp.debts)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { personId, debtId })
      .map(resp => resp.debts[0] || {})
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .create('/persons/{personId}/debts', { personId }, debt)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.debts.gen.singular').dispatchCallback());
  }

  update(personId: number, debtId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .update('/persons/{personId}/debts/{debtId}', { debtId, personId }, debt)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.debts.gen.singular').dispatchCallback());
  }
}
