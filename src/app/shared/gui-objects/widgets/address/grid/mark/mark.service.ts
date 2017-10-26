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

    // TODO(d.maltsev): use real data instead
    // return this.dataService
    //   .readAll('/persons/{personId}/personRoles/{personRole}/debtors/{debtorId}/debtsForVisit', data)
    //   .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.singular').dispatchCallback());

    return Observable.of([
      { id: 1, contract: null, debtAmount: 89908.53, currencyName: 'Рубль', statusCode: 1 },
      { id: 2, contract: null, debtAmount: 14341.23, currencyName: 'Рубль', statusCode: 1 },
    ]);
  }
}
