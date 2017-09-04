import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebtComponent } from './debt-component.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class DebtComponentService {
  static MESSAGE_DEBT_COMPONENT_SAVED = 'MESSAGE_DEBT_COMPONENT_SAVED';

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

  fetch(debtId: number, debtComponentId: number): Observable<IDebtComponent> {
    return this.dataService
      .read('/debts/{debtId}/components/{debtComponentId}', { debtId, debtComponentId })
      .map(response => response.components[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.debtComponents.gen.singular').dispatchCallback());
  }

  create(debtId: number, debtComponent: IDebtComponent): Observable<void> {
    return this.dataService
      .create('/debts/{debtId}/components', { debtId }, debtComponent)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.debtComponents.gen.singular').dispatchCallback());
  }

  update(debtId: number, debtComponentId: number, debtComponent: Partial<IDebtComponent>): Observable<void> {
    return this.dataService
      .update('/debts/{debtId}/components/{debtComponentId}', { debtId, debtComponentId }, debtComponent)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.debtComponents.gen.singular').dispatchCallback());
  }

  delete(debtId: number, debtComponentId: number): Observable<void> {
    return this.dataService
      .delete('/debts/{debtId}/components/{debtComponentId}', { debtId, debtComponentId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.debtComponents.gen.singular').dispatchCallback());
  }
}
