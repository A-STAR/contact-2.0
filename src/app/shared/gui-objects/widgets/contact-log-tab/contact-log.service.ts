import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IContactLog } from './contact-log.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class ContactLogService extends AbstractActionService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';

  private baseUrl = '/persons/{personId}/contacts';
  private extUrlNotSmsMessage = '/debts/{debtId}/contacts/{contactsLogId}';
  private extUrlSmsMessage = '/debts/{debtId}/sms/{contactsLogId}';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(personId: number, callCenter: boolean): Observable<Array<IContactLog>> {
    return this.dataService.create(this.baseUrl, { personId }, {}, { params: { callCenter } })
      .map(res => res.data)
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    const isSms = Number(contactType) === 4;
    const url = isSms ? this.extUrlSmsMessage : this.extUrlNotSmsMessage;

    return this.dataService.read(url, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  update(debtId: number, contactsLogId: number, comment: string): Observable<any> {
    return this.dataService.update(this.extUrlNotSmsMessage, { debtId, contactsLogId }, { comment })
      .catch(this.notificationsService.updateError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }
}
