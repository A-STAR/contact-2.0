import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import {
  IGridActionPayload
} from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Injectable()
export class  NextCallDateSetService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private actionGridFilterService: ActionGridFilterService
  ) {}

  private url = '/mass/debts/nextCall';

  setNextCall(idData: IGridActionPayload, nextCallDateTime: string): Observable<any> {
    return this.dataService.update(this.url, {},
      {
        idData: this.actionGridFilterService.buildRequest(idData),
        actionData: { nextCallDateTime }
      }
    )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.nextCallDate.gen.plural').dispatchCallback());
  }
}
