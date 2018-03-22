import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IContact } from '../contact-log.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContactLogDetailsService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  fetchAll(personId: number): Observable<IAGridResponse<IContact>> {
    return this.dataService
      .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, {})
      .catch(this.notificationsService.fetchError().entity(`entities.contacts.gen.plural`).dispatchCallback());
  }

}
