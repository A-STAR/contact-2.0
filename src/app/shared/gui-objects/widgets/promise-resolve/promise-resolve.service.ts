import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PromiseResolveService {
  private url = '/mass/promise';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  confirm(promiseIds: number[]): Observable<any> {
    return this.dataService
      .update(`${this.url}/confirm`, {}, { idData: { ids: promiseIds } })
      .catch(this.notificationsService.updateError().entity('entities.promises.gen.plural').dispatchCallback());
  }
}
