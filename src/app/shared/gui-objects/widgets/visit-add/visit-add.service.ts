import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IVisitParams, IMarkForVisitRequest } from './visit-add.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class VisitAddService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private baseUrl = '/mass/visits';

  createVisit(ids: number[][], actionData: IMarkForVisitRequest): Observable<any> {
    return this.dataService.create(this.baseUrl, {}, { idData: { ids }, actionData })
      .do(res => {
        if (res.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        } else {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.error('errors.default.massOp').entity('entities.massOps.addVisit').dispatchCallback());
   }
}
