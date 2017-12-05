import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IVisitParam, IVisitsBundle } from './visit-add.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class VisitAddService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private baseUrl = '/mass/visits';

  createVisit(params: IVisitParam[], actionData: IVisitsBundle): Observable<any> {
    return this.dataService.create(this.baseUrl, {}, { idData: { complexIdList: params }, actionData })
    // TODO(m.bobryshev): remove catch once the API is ready
    .catch(() => Observable.of({
        success: true,
        massInfo: { total: 2, processed: 1 }
      }))
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.error('errors.default.massOp').entity('entities.massOps.addVisit').dispatchCallback());
   }
}