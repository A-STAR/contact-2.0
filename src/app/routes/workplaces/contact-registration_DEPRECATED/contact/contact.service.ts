import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactPayload } from '../contact-select/contact-select.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(debtId: number, guid: string, contact: IContactPayload): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/changeContactPerson', { debtId, guid }, contact)
      .catch(this.notificationsService.createError().entity('entities.contacts.gen.singular').dispatchCallback());
  }
}
