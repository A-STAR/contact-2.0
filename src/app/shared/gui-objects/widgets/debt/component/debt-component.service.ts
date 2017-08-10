import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebtComponent } from './debt-component.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class DebtComponentService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<Array<IDebtComponent>> {
    return this.dataService
      .read('/debts/{debtId}/components', { debtId })
      .map(response => response.components)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debtComponents.gen.plural').dispatchCallback());
  }
}
