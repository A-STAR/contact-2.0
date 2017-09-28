import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactTreeNode } from './contact-property.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactPropertyService {
  private baseUrl = '/contactTypes/{contactType}/treeTypes/{treeType}/results';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(contactType: number, treeType: number): Observable<IContactTreeNode[]> {
    return this.dataService
      .read(this.baseUrl, { contactType, treeType })
      .do(console.log)
      .map(response => response.data)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.contact.gen.plural').dispatchCallback());
  }

  // fetch(personId: number, contactId: number): Observable<IContact> {
  //   return this.dataService
  //     .read(this.extUrl, { personId, contactId })
  //     .map(resp => resp.contactPersons[0] || {})
  //     .catch(this.notificationsService.error('errors.default.read').entity('entities.contact.gen.singular').dispatchCallback());
  // }

  // create(personId: number, contact: IContact): Observable<any> {
  //   return this.dataService
  //     .create(this.baseUrl, { personId }, contact)
  //     .catch(this.notificationsService.error('errors.default.create').entity('entities.contact.gen.singular').dispatchCallback());
  // }

  // update(personId: number, contactId: number, contact: IContact): Observable<any> {
  //   return this.dataService
  //     .update(this.extUrl, { personId, contactId }, contact)
  //     .catch(this.notificationsService.error('errors.default.update').entity('entities.contact.gen.singular').dispatchCallback());
  // }

  // delete(personId: number, contactId: number): Observable<any> {
  //   return this.dataService
  //     .delete(this.extUrl, { personId, contactId })
  //     .catch(this.notificationsService.error('errors.default.delete').entity('entities.contact.gen.singular').dispatchCallback());
  // }
}
