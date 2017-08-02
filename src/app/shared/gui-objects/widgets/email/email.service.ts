import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmail, IEmailsResponse } from './email.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class EmailService {
  constructor(private dataService: DataService) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IEmail>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/emails', { entityType, entityId })
      .map((response: IEmailsResponse) => response.emails);
  }

  fetch(entityType: number, entityId: number, emailId: number): Observable<IEmail> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId })
      .map((response: IEmailsResponse) => response.emails[0]);
  }

  create(entityType: number, entityId: number, email: IEmail): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/emails/', { entityType, entityId }, email);
  }

  update(entityType: number, entityId: number, emailId: number, email: Partial<IEmail>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId }, email);
  }

  block(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isBlocked: 1 });
  }

  unblock(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.update(entityType, entityId, emailId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, emailId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/emails/{emailId}', { entityType, entityId, emailId });
  }
}
