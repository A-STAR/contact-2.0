import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class OpenDebtCardService {
  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/persons/{personId}/debts';

  getFirstDebtsByUserId(payload: IGridActionPayload): Observable<any> {
    return this.dataService.read(this.url, this.actionGridFilterService.buildRequest(payload))
      .map(res => res && res.id)
      .catch(this.notificationsService.deleteError().entity('entities.debts.gen.plural').dispatchCallback());
   }
}
