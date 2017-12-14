import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { IContactLog } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class ContactLogService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';
  static CONTACT_TYPE_EMAIL = 6;
  static CONTACT_TYPE_SMS = 4;

  private baseUrl = '/persons/{personId}/contacts';
  private urlDefault = '/debts/{debtId}/contacts/{contactsLogId}';
  private urlSMS = '/debts/{debtId}/sms/{contactsLogId}';
  private urlEmail = '/debts/{debtId}/email/{contactsLogId}';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number, callCenter: boolean): Observable<Array<IContactLog>> {
    return this.dataService.create(this.baseUrl, { personId }, {}, { params: { callCenter } })
      .map(res => res.data)
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    switch (contactType) {
      case ContactLogService.CONTACT_TYPE_SMS:
        return this.fetchSmsContact(debtId, contactsLogId, contactType, callCenter);
      case ContactLogService.CONTACT_TYPE_EMAIL:
        return this.fecthEmailContact(debtId, contactsLogId, contactType, callCenter);
      default:
        return this.fetchDefaultContact(debtId, contactsLogId, contactType, callCenter);
    }
  }

  fetchDefaultContact(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlDefault, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  fetchSmsContact(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlSMS, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  fecthEmailContact(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlEmail, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  update(debtId: number, contactsLogId: number, comment: string): Observable<any> {
    return this.dataService.update(this.urlDefault, { debtId, contactsLogId }, { comment })
      .catch(this.notificationsService.updateError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }
}
