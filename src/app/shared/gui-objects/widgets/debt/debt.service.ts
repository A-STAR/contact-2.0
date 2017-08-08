import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDebt } from './debt.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

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
}
