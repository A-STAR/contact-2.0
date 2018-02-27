import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperator } from './operator-details.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class OperatorDetailsService {

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetch(idData: IGridActionPayload): Observable<IOperator> {
    const { userId } = this.actionGridFilterService.buildRequest(idData);
    return this.dataService.read('/users/{userId}/gridDetail', { userId })
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.singular').dispatchCallback());
  }
}
