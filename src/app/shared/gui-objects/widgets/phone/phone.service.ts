import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone, ISMSSchedule } from './phone.interface';
import { INamedValue } from '../../../../core/converter/value-converter.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PhoneService {
  static MESSAGE_PHONE_SAVED = 'MESSAGE_PHONE_SAVED';
  baseUrl = '/entityTypes/{entityType}/entities/{entityId}/phones';
  singular = 'entities.phones.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number, callCenter: boolean): Observable<IPhone[]> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.phones.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<IPhone> {
    return this.dataService
      .read(`${this.baseUrl}/{phoneId}`, { entityType, entityId, phoneId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity(this.singular).dispatchCallback());
  }

  create(entityType: number, entityId: number, callCenter: boolean, phone: IPhone): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, phone, { params: { callCenter } })
      .catch(this.notificationsService.createError().entity(this.singular).dispatchCallback());
  }

  update(
    entityType: number,
    entityId: number,
    phoneId: number,
    callCenter: boolean,
    phone: Partial<IPhone>,
  ): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{phoneId}`, { entityType, entityId, phoneId }, phone, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity(this.singular).dispatchCallback());
  }

  block(
    entityType: number,
    entityId: number,
    phoneId: number,
    callCenter: boolean,
    inactiveReasonCode: number,
  ): Observable<void> {
    return this.update(entityType, entityId, phoneId, callCenter, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<void> {
    return this.update(entityType, entityId, phoneId, callCenter, { isInactive: 0 });
  }

  scheduleSMS(debtId: number, schedule: ISMSSchedule): Observable<void> {
    return this.dataService
      .create('/debts/{debtId}/sms', { debtId }, schedule)
      .catch(this.notificationsService.createError().entity('entities.sms.gen.singular').dispatchCallback());
  }

  fetchSMSTemplates(typeCode: number, recipientTypeCode: number, isSingleSending: boolean): Observable<INamedValue[]> {
    const url = '/lookup/templates/typeCode/{typeCode}/recipientsTypeCode/{recipientTypeCode}?isSingleSending={isSingleSending}';
    return this.dataService
      .readAll(url, { typeCode, recipientTypeCode, isSingleSending: Number(isSingleSending) })
      .catch(this.notificationsService.fetchError().entity('entities.messageTemplate.gen.plural').dispatchCallback());
  }

  fetchMessageTemplateText(debtId: number, personId: number, personRole: number, templateId: number): Observable<string> {
    const url = '/debts/{debtId}/persons/{personId}/personRoles/{personRole}/templates/{templateId}';
    return this.dataService
      .read(url, { debtId, personId, personRole, templateId })
      .catch(this.notificationsService.fetchError().entity('entities.messageTemplate.gen.plural').dispatchCallback())
      .map(response => response.text);
  }

  delete(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{phoneId}`, { entityType, entityId, phoneId }, { params: { callCenter } })
      .catch(this.notificationsService.deleteError().entity(this.singular).dispatchCallback());
  }
}
