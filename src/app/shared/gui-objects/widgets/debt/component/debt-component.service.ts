import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebtComponent } from './debt-component.interface';

import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class DebtComponentService {
  static MESSAGE_DEBT_COMPONENT_SAVED = 'MESSAGE_DEBT_COMPONENT_SAVED';

  private errPlural = 'entities.debtComponents.gen.plural';
  private errSingular = 'entities.debtComponents.gen.singular';

  private url = '/debts/{debtId}/components';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number, callCenter: boolean): Observable<Array<IDebtComponent>> {
    return this.dataService
      .readAll(this.url, { debtId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity(this.errPlural).dispatchCallback());
  }

  fetch(debtId: number, debtComponentId: number): Observable<IDebtComponent> {
    return this.dataService
      .read(`${this.url}/{debtComponentId}`, { debtId, debtComponentId })
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(debtId: number, debtComponent: IDebtComponent): Observable<void> {
    return this.dataService
      .create(this.url, { debtId }, debtComponent)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(debtId: number, debtComponentId: number, debtComponent: Partial<IDebtComponent>): Observable<void> {
    return this.dataService
      .update(`${this.url}/{debtComponentId}`, { debtId, debtComponentId }, debtComponent)
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(debtId: number, debtComponentId: number): Observable<void> {
    return this.dataService
      .delete(`${this.url}/{debtComponentId}`, { debtId, debtComponentId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
