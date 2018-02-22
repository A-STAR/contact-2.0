import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDebtorActionLog } from './action-log.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

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
      .pipe(
        catchError(this.notifications.fetchError().entity('entities.actionsLog.gen.plural').dispatchCallback()),
      );
  }
}
