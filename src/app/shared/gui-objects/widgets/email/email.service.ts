import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmail, IEmailsResponse } from './email.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class EmailService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IEmail>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/emails', { entityType, entityId })
      .map((response: IEmailsResponse) => response.emails)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.emails.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, emailId: number): Observable<IEmail> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId })
      .map((response: IEmailsResponse) => response.emails[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.emails.gen.singular').dispatchCallback());
  }

  create(entityType: number, entityId: number, email: IEmail): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/emails/', { entityType, entityId }, email)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.emails.gen.singular').dispatchCallback());
  }

  update(entityType: number, entityId: number, emailId: number, email: Partial<IEmail>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId }, email)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.emails.gen.singular').dispatchCallback());
  }

  block(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isBlocked: 1 });
  }

  unblock(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.emails.gen.singular').dispatchCallback());
  }
}