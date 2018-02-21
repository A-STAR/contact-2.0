import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PromiseResolveService {
  private url = '/mass/promises';

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  confirm(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/confirm`, {},
        {
          idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.promises.gen.plural').dispatchCallback());
  }

  remove(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/delete`, {},
        {
          idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.deleteError().entity('entities.promises.gen.plural').dispatchCallback());
  }
}
