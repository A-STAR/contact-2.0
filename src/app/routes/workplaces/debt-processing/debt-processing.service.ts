import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDebt } from './debt-processing.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class DebtProcessingService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(name: string, filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IDebt>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService.create(`/list?name=${name}`, {}, request)
      .catch(this.notifications.fetchError().entity('entities.actionsLog.gen.plural').dispatchCallback());
  }
}
