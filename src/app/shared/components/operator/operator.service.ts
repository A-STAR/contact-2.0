import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from '../operator/operator.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class OperatorService {
  private url = '/users/forTransferCall';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  fetchAll(): Observable<IOperator[]> {
    return this.dataService
      .readAll(this.url)
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.plural').dispatchCallback());
  }
}
