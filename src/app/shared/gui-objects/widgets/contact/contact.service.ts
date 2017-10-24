import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContact } from './contact.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactService {
  static MESSAGE_CONTACT_SAVED = 'MESSAGE_CONTACT_SAVED';

  private baseUrl = '/persons/{personId}/contactpersons';
  private extUrl = `${this.baseUrl}/{contactId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<IContact[]> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.contact.gen.plural').dispatchCallback());
  }

  fetch(personId: number, contactId: number): Observable<IContact> {
    return this.dataService
      .read(this.extUrl, { personId, contactId })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.contact.gen.singular').dispatchCallback());
  }

  create(personId: number, contact: IContact): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { personId }, contact)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.contact.gen.singular').dispatchCallback());
  }

  update(personId: number, contactId: number, contact: IContact): Observable<any> {
    return this.dataService
      .update(this.extUrl, { personId, contactId }, contact)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.contact.gen.singular').dispatchCallback());
  }

  delete(personId: number, contactId: number): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { personId, contactId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.contact.gen.singular').dispatchCallback());
  }
}
