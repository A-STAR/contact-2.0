import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone } from './phone.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PhoneService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(debtId: number, guid: string, phone: IPhone): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/phone', { debtId, guid }, phone)
      .catch(this.notificationsService.createError().entity('entities.phones.gen.singular').dispatchCallback());
  }
}
