import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PromiseResolveService {
  private url = '/mass/promises';

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  confirm(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/confirm`, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.updateError().entity('entities.promises.gen.plural').dispatchCallback());
  }

  remove(idData: IGridActionPayload): Observable<any> {
    return this.dataService
      .update(`${this.url}/delete`, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.deleteError().entity('entities.promises.gen.plural').dispatchCallback());
  }
}
