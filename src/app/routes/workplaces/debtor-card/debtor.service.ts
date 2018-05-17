import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson } from '../../../core/app-modules/app-modules.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  private _debtors = new Set<string>();

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  get debtors(): Set<string> {
    return this._debtors;
  }

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  addTab(debtorId: number, debtId: number): void {
    this._debtors.add(debtorId + ':' + debtId);
  }
}
