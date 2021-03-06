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

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IActionLog>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create('/list?name=actions', {}, request)
      .catch(this.notifications.fetchError().entity('entities.actionsLog.gen.plural').dispatchCallback());
  }
}
