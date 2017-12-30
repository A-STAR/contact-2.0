import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IDebtorActionLog } from './action-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionLogService {

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(
    personId: number,
    filters: FilterObject,
    params: IAGridRequestParams
  ): Observable<IAGridResponse<IDebtorActionLog>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService
      // the url can be '/list?name=personActions' as well
      .create('/persons/{personId}/actions', { personId }, request)
      .catch(
        this.notifications.fetchError()
          .entity('entities.actionsLog.gen.plural').dispatchCallback()
      );
  }
}
