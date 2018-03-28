import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IContact, IContactLink } from './contact-persons.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContactPersonsService extends AbstractActionService {
  static MESSAGE_CONTACT_SAVED = 'MESSAGE_CONTACT_SAVED';

  private baseUrl = '/persons/{personId}/contactpersons';
  private extUrl = `${this.baseUrl}/{contactId}`;

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(personId: number): Observable<IContact[]> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.contacts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, contactId: number): Observable<IContact> {
    return this.dataService
      .read(this.extUrl, { personId, contactId })
      .catch(this.notificationsService.fetchError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  create(personId: number, contact: IContactLink): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { personId }, contact)
      .catch(this.notificationsService.createError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  update(personId: number, contactId: number, contact: IContactLink): Observable<any> {
    return this.dataService
      .update(this.extUrl, { personId, contactId }, contact)
      .catch(this.notificationsService.updateError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  delete(personId: number, contactId: number): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { personId, contactId })
      .catch(this.notificationsService.deleteError().entity('entities.contacts.gen.singular').dispatchCallback());
  }
}
