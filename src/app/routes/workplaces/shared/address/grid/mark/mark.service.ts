import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { Debt } from '@app/entities';

@Injectable()
export class MarkService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchDebtsForPerson(personId: number, personRole: number, debtorId: number, callCenter: boolean): Observable<Debt[]> {
    const data = { personId, personRole, debtorId };
    return this.dataService
      .readAll('/persons/{personId}/personRoles/{personRole}/debtors/{debtorId}/debtsForVisit', data, { params: { callCenter }})
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.singular').dispatchCallback());
  }
}
