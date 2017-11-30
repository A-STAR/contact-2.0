import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ISingleVisitRels, IVisitsBundle } from './visit-add.interface';

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
    aims: ISingleVisitRels[], perposeCode: number, comment: string
  ): Observable<any> {
      return this.dataService.update(
        this.baseUrl,
        {},
        {
          idData: {
            complexIdList: aims
          },
          actionData: { perposeCode, comment }
        })
        // mock on catch
        .catch(() => Observable.of({
            success: true,
            massInfo: {
              total: 2,
              processed: 2
            }
        }))
        .do(res => {
          if (!res.success) {
            // TODO make dict when its will be fixed
            this.notificationsService.error('errors.default.read').entity('entities.user.constants.gen.plural').callback();
            return;
          }
        });
      // TODO unmock when api ready, make dict for catc
      // .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').callback());
   }
}
