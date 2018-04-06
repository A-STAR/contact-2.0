import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';

@Injectable()
export class  NextCallDateSetService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private actionGridService: ActionGridService
  ) {}

  private url = '/mass/debts/nextCall';

  setNextCall(idData: IGridActionPayload, nextCallDateTime: string): Observable<any> {
    return this.dataService.update(this.url, {},
      {
        idData: this.actionGridService.buildRequest(idData),
        actionData: { nextCallDateTime }
      }
    )
    .catch(this.notificationsService.updateError().entity('entities.nextCallDate.gen.plural').dispatchCallback());
  }
}
