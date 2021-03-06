import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';
import { IWorkTaskEntry } from './work-task.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class WorkTaskService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(name: string, filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IWorkTaskEntry>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService.create(`/list?name=${name}`, {}, request)
      .catch(this.notifications.fetchError().entity('entities.workTask.gen.plural').dispatchCallback());
  }
}
