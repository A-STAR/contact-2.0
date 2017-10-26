import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../../core/notifications/notifications.service';

@Injectable()
export class MarkService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchDebtsForPerson(personId: number, personRole: number, debtorId: number): Observable<any> {
    const data = { personId, personRole, debtorId };
    return this.dataService
      .readAll('/persons/{personId}/personRoles/{personRole}/debtors/{debtorId}/debtsForVisit', data)
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.singular').dispatchCallback());
  }
}
