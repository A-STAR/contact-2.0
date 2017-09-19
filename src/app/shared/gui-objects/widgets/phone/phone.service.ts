import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone, IPhonesResponse, ISMSSchedule } from './phone.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PhoneService {
  static MESSAGE_PHONE_SAVED = 'MESSAGE_PHONE_SAVED';
  baseUrl = '/entityTypes/{entityType}/entities/{entityId}/phones';
  extUrl = `${this.baseUrl}/{phoneId}`;
  singular = 'entities.phones.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IPhone>> {
    return this.dataService
      .read(this.baseUrl, { entityType, entityId })
      .map((response: IPhonesResponse) => response.phones)
      .catch(this.notificationsService.fetchError().entity('entities.phones.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, phoneId: number): Observable<IPhone> {
    return this.dataService
      .read(this.extUrl, { entityType, entityId, phoneId })
      .map((response: IPhonesResponse) => response.phones[0])
      .catch(this.notificationsService.fetchError().entity(this.singular).dispatchCallback());
  }

  create(entityType: number, entityId: number, phone: IPhone): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, phone)
      .catch(this.notificationsService.createError().entity(this.singular).dispatchCallback());
  }

  update(entityType: number, entityId: number, phoneId: number, phone: Partial<IPhone>): Observable<void> {
    return this.dataService
      .update(this.extUrl, { entityType, entityId, phoneId }, phone)
      .catch(this.notificationsService.updateError().entity(this.singular).dispatchCallback());
  }

  block(entityType: number, entityId: number, phoneId: number, blockReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 1, blockReasonCode });
  }

  unblock(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 0 });
  }

  scheduleSMS(debtId: number, schedule: ISMSSchedule): Observable<void> {
    return this.dataService
      .create('/debts/{debtId}/sms', { debtId }, schedule)
      .catch(this.notificationsService.createError().entity('entities.sms.gen.singular').dispatchCallback());
  }

  delete(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.dataService
      .delete(this.extUrl, { entityType, entityId, phoneId })
      .catch(this.notificationsService.deleteError().entity(this.singular).dispatchCallback());
  }
}
