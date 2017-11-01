import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactLog } from './contact-log.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactLogService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';

  private baseUrl = '/persons/{personId}/contacts';
  private extUrlNotSmsMessage = `${this.baseUrl}/contacts/{contactsId}`;
  private extUrlSmsMessage = `${this.baseUrl}/sms/{contactsId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IContactLog>> {
    return this.dataService.readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(personId: number, contactsId: number, contactType: number): Observable<IContactLog> {
    return this.dataService.read(
      contactType < 4
        ? this.extUrlNotSmsMessage
        : this.extUrlSmsMessage,
      { personId, contactsId })
      .catch(this.notificationsService.error('errors.default.read')
      .entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  create(personId: number, contact: IContactLog): Observable<IContactLog> {
    return this.dataService.create(this.baseUrl, { personId }, contact)
      .catch(this.notificationsService
        .error('errors.default.create')
        .entity('entities.contactLog.gen.singular')
        .dispatchCallback()
      );
  }

  update(personId: number, contactsId: number, contactItem: IContactLog): Observable<any> {
    return this.dataService.update(this.extUrlNotSmsMessage, { personId, contactsId }, contactItem)
      .catch(this.notificationsService
        .error('errors.default.update')
        .entity('entities.contactLog.gen.singular')
        .dispatchCallback()
      );
  }
}
