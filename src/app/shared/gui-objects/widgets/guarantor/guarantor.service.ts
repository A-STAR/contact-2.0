import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGuaranteeContract } from './guarantor.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class GuarantorService {
  static MESSAGE_GUARANTOR_SAVED = 'MESSAGE_GUARANTOR_SAVED';

  private url = '/debts/{debtId}/guaranteeContract';
  private errSingular = 'entities.employment.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<IGuaranteeContract[]> {
    return this.dataService
      .read(this.url, { debtId })
      .map(resp => resp.data)
      .catch(this.notificationsService.fetchError().entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contractId: number): Observable<IGuaranteeContract> {
    return this.dataService
      .read(`${this.url}/{contractId}`, { debtId, contractId })
      .map(resp => resp.data[0] || {})
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(debtId: number, contract: IGuaranteeContract): Observable<any> {
    return this.dataService
      .create(this.url, { debtId }, contract)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(debtId: number, contractId: number, contract: IGuaranteeContract): Observable<any> {
    return this.dataService
      .update(`${this.url}/{contractId}`, { debtId, contractId }, contract)
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(debtId: number, contractId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{contractId}`, { debtId, contractId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
