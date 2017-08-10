import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebt, IDebtComponent } from './debt.interface';

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
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { personId, debtId })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, debt: IDebt): Observable<void> {
    return Observable.of(null);
  }

  update(personId: number, debtId: number, debt: IDebt): Observable<void> {
    return Observable.of(null);
  }

  fetchComponents(debtId: number): Observable<Array<IDebtComponent>> {
    return this.dataService
      .read('/debts/{debtId}/components', { debtId })
      .map(response => response.components)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debtComponents.gen.plural').dispatchCallback());
  }
}
