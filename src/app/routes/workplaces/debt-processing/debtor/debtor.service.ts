import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson, IPersonsResponse } from './debtor.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetch(personId: number): Observable<IPerson> {
    return this.dataService
      .read('/persons/{personId}', { personId })
      .map((response: IPersonsResponse) => response.persons[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.persons.gen.singular').dispatchCallback());
  }

  update(personId: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{personId}', { personId }, person)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.persons.gen.singular').dispatchCallback());
  }
}
