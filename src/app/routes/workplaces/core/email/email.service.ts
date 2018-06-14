import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { IAppState } from '@app/core/state/state.interface';
import { IEmail, IEmailSchedule } from './email.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class EmailService {
  static EMAIL_SAVE_SUCCESS = 'EMAIL_SAVE_SUCCESS';

  baseUrl = '/entityTypes/{entityType}/entities/{entityId}/emails';
  singularErr = 'entities.emails.gen.singular';

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IEmail>> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId })
      .catch(this.notificationsService.fetchError().entity('entities.emails.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, emailId: number): Observable<IEmail> {
    return this.dataService
      .read(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId })
      .catch(this.notificationsService.fetchError().entity(this.singularErr).dispatchCallback());
  }

  create(entityType: number, entityId: number, email: IEmail): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, email)
      .catch(this.notificationsService.createError().entity(this.singularErr).dispatchCallback());
  }

  update(entityType: number, entityId: number, emailId: number, email: Partial<IEmail>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId }, email)
      .catch(this.notificationsService.updateError().entity(this.singularErr).dispatchCallback());
  }

  block(entityType: number, entityId: number, emailId: number, inactiveReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isInactive: 0 });
  }

  delete(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{emailId}`, { entityType, entityId, emailId })
      .catch(this.notificationsService.deleteError().entity(this.singularErr).dispatchCallback());
  }

  scheduleEmail(debtId: number, schedule: IEmailSchedule): Observable<void> {
    return this.dataService
      .create('/debts/{debtId}/email', { debtId }, schedule)
      .catch(this.notificationsService.createError().entity('entities.email.gen.singular').dispatchCallback());
  }

  dispatchSaveAction(): void {
    this.store.dispatch({ type: EmailService.EMAIL_SAVE_SUCCESS });
  }

  get onSave$(): Observable<any> {
    return this.actions.ofType(EmailService.EMAIL_SAVE_SUCCESS);
  }
}
