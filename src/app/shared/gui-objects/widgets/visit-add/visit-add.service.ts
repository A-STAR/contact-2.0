import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ISingleVisit, IVisitsBundle } from './visit-add.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class VisitAddService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private baseUrl = '/mass/visits';

  createVisit(
    aims: ISingleVisit[], actionData: IVisitsBundle
  ): Observable<any> {
      return this.dataService.update(
        this.baseUrl,
        {},
        {
          idData: {
            complexIdList: aims
          },
          actionData
        })
        // mock on catch (m.bobryshev)
        .catch(() => Observable.of({
            success: true,
            massInfo: {
              total: 2,
              processed: 1
            }
        }))
        .do(res => {
          const processed = res.massInfo.processed.toString();
          const total = res.massInfo.total.toString();
          const params = { processed, total };

          !!res.success
            ? this.notificationsService.info('default.dialog.result.message').params(params).dispatch()
            : this.notificationsService.warning('default.dialog.result.message').params(params).dispatch();
        })
        .catch(() => {
          this.notificationsService.error('errors.default.massOp').entity('entities.massOps.addVisit').dispatch();
          return Observable.of(null);
        });
   }
}
