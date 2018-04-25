import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IContactPerson, IContactLink } from './contact-persons.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContactPersonsService extends AbstractActionService {
  static MESSAGE_CONTACT_PERSON_SAVED = 'MESSAGE_CONTACT_PERSON_SAVED';

  private baseUrl = '/persons/{personId}/contactpersons';
  private extUrl = `${this.baseUrl}/{contactPersonId}`;

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  dispatchContactPersonSavedMessage(): void {
    this.dispatchAction(ContactPersonsService.MESSAGE_CONTACT_PERSON_SAVED);
  }

  fetchAll(personId: number): Observable<IContactPerson[]> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.contacts.gen.plural').dispatchCallback());
  }

  /**
   * @param personId        ID of person
   * @param contactPersonId ID of link in contact_person pivot table
   */
  fetch(personId: number, contactPersonId: number): Observable<IContactPerson> {
    return this.dataService
      .read(this.extUrl, { personId, contactPersonId })
      .catch(this.notificationsService.fetchError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  create(personId: number, contact: Partial<IContactLink>): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { personId }, contact)
      .catch(this.notificationsService.createError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  /**
   * @param personId        ID of person
   * @param contactPersonId ID of link in contact_person pivot table
   */
  update(personId: number, contactPersonId: number, contact: Partial<IContactLink>): Observable<any> {
    return this.dataService
      .update(this.extUrl, { personId, contactPersonId }, contact)
      .catch(this.notificationsService.updateError().entity('entities.contacts.gen.singular').dispatchCallback());
  }

  /**
   * @param personId        ID of person
   * @param contactPersonId ID of link in contact_person pivot table
   */
  delete(personId: number, contactPersonId: number): Observable<any> {
    return this.dataService
      .delete(this.extUrl, { personId, contactPersonId })
      .catch(this.notificationsService.deleteError().entity('entities.contacts.gen.singular').dispatchCallback());
  }
}
