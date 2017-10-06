import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmployment, IGuaranteeContract } from './guarantor.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class GuarantorService {
  static MESSAGE_EMPLOYMENT_SAVED = 'MESSAGE_EMPLOYMENT_SAVED';

  private url = '/debts/{debtId}/guaranteeContract';
  private errSingular = 'entities.employment.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number): Observable<IGuaranteeContract[]> {
    return this.dataService
      .read(this.url, { debtId })
      .map(resp => resp.guarantorWithContract)
      .catch(this.notificationsService.fetchError().entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(personId: number, employmentId: number): Observable<IEmployment> {
    return this.dataService
      .read(`${this.url}/{employmentId}`, { personId, employmentId })
      .map(resp => resp.guarantorWithContract[0] || {})
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(personId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .create(this.url, { personId }, employment)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(personId: number, employmentId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .update(`${this.url}/{employmentId}`, { personId, employmentId }, employment)
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(personId: number, employmentId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{employmentId}`, { personId, employmentId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
