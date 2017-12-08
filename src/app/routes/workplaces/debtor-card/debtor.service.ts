import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { IContactRegistrationParams } from '../../../core/debt/debt.interface';
import { IDebt, IPerson } from '../../../core/app-modules/app-modules.interface';

import { DataService } from '../../../core/data/data.service';
import { DebtService } from '../../../core/debt/debt.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  constructor(
    private dataService: DataService,
    private debtService: DebtService,
    private notificationsService: NotificationsService,
  ) {}

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }
}
