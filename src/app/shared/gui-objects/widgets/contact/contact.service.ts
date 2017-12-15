import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IContact } from './contact.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactService extends AbstractActionService {
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
