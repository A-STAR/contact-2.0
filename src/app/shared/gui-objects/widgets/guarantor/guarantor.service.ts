import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGuarantor } from '../guarantee/guarantee.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class GuarantorService {
  static MESSAGE_GUARANTOR_SAVED = 'MESSAGE_GUARANTOR_SAVED';
  static MESSAGE_GUARANTEE_CONTRACT_SAVED = 'MESSAGE_GUARANTEE_CONTRACT_SAVED';

  private url = '/debts/{debtId}/guaranteeContract/{contractId}/guarantor';
  private errSingular = 'entities.employment.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<IGuarantor[]> {
    return this.dataService
      .read(this.url, { debtId })
      .map(resp => resp.data)
      .catch(this.notificationsService.fetchError().entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contractId: number): Observable<IGuarantor> {
    return this.dataService
      .read(`${this.url}`, { debtId, contractId })
      .map(resp => resp.data[0] || {})
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(debtId: number, contractId: number, personId: number): Observable<any> {
    return this.dataService
      .create(this.url, { debtId, contractId, personId }, {})
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  delete(debtId: number, contractId: number, personId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{personId}`, { debtId, contractId, personId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
