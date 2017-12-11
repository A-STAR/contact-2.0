import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson } from '../../../core/app-modules/app-modules.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }
}
