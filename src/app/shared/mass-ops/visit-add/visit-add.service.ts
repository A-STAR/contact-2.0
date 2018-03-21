import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IMarkForVisitRequest } from './visit-add.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class VisitAddService {
  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private baseUrl = '/mass/visits';

  createVisit(idData: IGridActionPayload, actionData: IMarkForVisitRequest): Observable<any> {
    return this.dataService.create(this.baseUrl, {},
        {
          idData: this.actionGridService.buildRequest(idData),
          actionData
        }
      )
      .do(res => {
        if (res.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        } else {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.error('errors.default.massOp').entity('entities.massOps.addVisit').dispatchCallback());
   }

   getVisitsCount(idData: IGridActionPayload): number | string {
    return this.actionGridService.getSelectionCount(idData) || '';
  }
}
