import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactLogGridService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<any[]> {
    return this.dataService
      .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, {})
      .map(response => response.data)
      // TODO(d.maltsev): correct entity
      .catch(this.notificationsService.fetchError().entity(`entities.addresses.gen.plural`).dispatchCallback());
  }
}
