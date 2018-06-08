import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson } from '@app/core/app-modules/app-modules.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
// import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';

@Injectable()
export class DebtorService {
  private _debtors = new Map<number, number>();

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    // private menuService: GuiObjectsService,
  ) {}

  get debtors(): Map<number, number> {
    return this._debtors;
  }

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  addTab(debtorId: number, debtId: number): void {
    this._debtors.set(debtorId, debtId);

    // this.menuService.setDebtor(debtorId);
  }
}
