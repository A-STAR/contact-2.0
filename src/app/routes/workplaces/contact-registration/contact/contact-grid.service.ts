import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactGridService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(guid: string, debtId: number, excludePersonId: number): Observable<any[]> {
    const url = '/regContact/debts/{debtId}/contactPersons';
    return this.dataService
      .readAll(url, { guid, debtId }, { params: { excludePersonId } })
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.plural').dispatchCallback());
  }
}
