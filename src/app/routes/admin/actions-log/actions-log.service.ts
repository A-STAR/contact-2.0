import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IActionLog } from './actions-log.interface';
import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../core/data/data.service';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ActionsLogService {
  // static ACTION_TYPES_FETCH_SUCCESS           = 'ACTION_TYPES_FETCH_SUCCESS';
  // static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS  = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  // static ACTIONS_LOG_FETCH                    = 'ACTIONS_LOG_FETCH';
  // static ACTIONS_LOG_FETCH_SUCCESS            = 'ACTIONS_LOG_FETCH_SUCCESS';
  // static ACTIONS_LOG_DESTROY                  = 'ACTIONS_LOG_DESTROY';

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IActionLog>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create('/list?name=actions', {}, request)
      .catch(this.notifications.fetchError().entity('entities.actionsLog.gen.plural').callback());
  }

}
