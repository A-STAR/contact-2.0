import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { IContactLog } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class ContactLogService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';

  private baseUrl = '/persons/{personId}/contacts';
  private extUrlNotSmsMessage = '/debts/{debtId}/contacts/{contactsLogId}';
  private extUrlSmsMessage = '/debts/{debtId}/sms/{contactsLogId}';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IContactLog>> {
    return this.dataService.create(this.baseUrl, { personId }, {})
    .map(res => res.data)
    .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number): Observable<IContactLog> {
    const isSms = Number(contactType) === 4;
    const url = isSms ? this.extUrlSmsMessage : this.extUrlNotSmsMessage;

    return this.dataService.read(url, { debtId, contactsLogId })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  update(debtId: number, contactsLogId: number, comment: string): Observable<any> {
    return this.dataService.update(this.extUrlNotSmsMessage, { debtId, contactsLogId }, { comment })
      .catch(this.notificationsService.updateError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }
}
