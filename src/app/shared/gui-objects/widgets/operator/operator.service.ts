import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from '../operator/operator.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class OperatorService {
  static MESSAGE_OPERATOR_SELECTED = 'MESSAGE_OPERATOR_SELECTED';

  private url = '/users/forAssign';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<IOperator[]> {
    return this.dataService
      .readAll(this.url)
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.plural').dispatchCallback());
  }
}
