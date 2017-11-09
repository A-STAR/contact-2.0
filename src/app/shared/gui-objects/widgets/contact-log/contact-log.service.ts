import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContact } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactLogService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<IContact[]> {
    return this.dataService
      .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, {})
      .map(response => response.data)
      .catch(this.notificationsService.fetchError().entity(`entities.contacts.gen.plural`).dispatchCallback());
  }
}
