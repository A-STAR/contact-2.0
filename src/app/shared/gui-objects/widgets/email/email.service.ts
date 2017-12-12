import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmail, IEmailSchedule } from './email.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { INamedValue } from '../../../../core/converter/value-converter.interface';

@Injectable()
export class EmailService {
  static MESSAGE_EMAIL_SAVED = 'MESSAGE_EMAIL_SAVED';
  baseUrl = '/entityTypes/{entityType}/entities/{entityId}/emails';
  singularErr = 'entities.emails.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IEmail>> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId })
      .catch(this.notificationsService.fetchError().entity('entities.emails.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, emailId: number): Observable<IEmail> {
    return this.dataService
      .read(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId })
      .catch(this.notificationsService.fetchError().entity(this.singularErr).dispatchCallback());
  }

  create(entityType: number, entityId: number, email: IEmail): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, email)
      .catch(this.notificationsService.createError().entity(this.singularErr).dispatchCallback());
  }

  update(entityType: number, entityId: number, emailId: number, email: Partial<IEmail>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId }, email)
      .catch(this.notificationsService.updateError().entity(this.singularErr).dispatchCallback());
  }

  block(entityType: number, entityId: number, emailId: number, inactiveReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isInactive: 0 });
  }

  delete(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId })
      .catch(this.notificationsService.deleteError().entity(this.singularErr).dispatchCallback());
  }

  scheduleSMS(debtId: number, schedule: IEmailSchedule): Observable<void> {
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
}
