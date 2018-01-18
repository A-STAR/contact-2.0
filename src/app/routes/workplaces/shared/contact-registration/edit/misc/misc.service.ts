import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IMiscData } from './misc.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class MiscService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(debtId: number, guid: string, data: IMiscData): Observable<any> {
    return this.dataService
      .update('/debts/{debtId}/contactRequest/{guid}', { debtId, guid }, data)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
