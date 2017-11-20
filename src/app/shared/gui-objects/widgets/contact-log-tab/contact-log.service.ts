import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { IContactLog } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class ContactLogService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';

  private baseUrl = '/api/persons/{personId}/contacts';
  private extUrlNotSmsMessage = '/api/debts/{debtId}/contacts/{contactsLogId}';
  private extUrlSmsMessage = '/api/debts/{debtId}/sms/{contactsLogId}';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IContactLog>> {
    return this.dataService.post(this.baseUrl, { personId }, {})
    .map(res => res.data)
    .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number): Observable<IContactLog> {
    return this.dataService.read(
        Number(contactType) !== 4
          ? this.extUrlNotSmsMessage
          : this.extUrlSmsMessage,
        { debtId, contactsLogId })
      // TODO mock becouse api not ready
      .catch(() => Observable.of({
        contract: 564654654,
        fullName: 'Денисов Евгений Викторович',
        personRole: 1,
        sentDateTime: new Date('2017-08-26T21:00:00Z'),
        contactPhone: '6546546546546',
        userFullName: 'Иванов Иван Иванович',
        startDateTime: new Date('2017-07-26T05:00:00Z'),
        comment: 'Контакт. Тестовый. Долг 1  .1033',
        text: 'Тестовый текст сообщения СМС',
        status: 1,
        contactType: 4,
        userId: 100
      }));
      // TODO uncomment when unmock
      // .catch(this.notificationsService.error('errors.default.read')
      // .entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  update(debtId: number, contactsLogId: number, comment: string): Observable<any> {
    return this.dataService.update(this.extUrlNotSmsMessage, { debtId, contactsLogId }, { comment })
      .catch(this.notificationsService
        .error('errors.default.update')
        .entity('entities.contactLog.gen.singular')
        .dispatchCallback()
      );
  }
}
