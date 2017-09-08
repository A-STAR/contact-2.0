import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';
import { IDebt } from './debt-processing.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class DebtProcessingService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IDebt>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create('/list?name=debtsprocessingall', {}, request)
      .catch(
        this.notifications.error('errors.default.read')
          .entity('entities.actionsLog.gen.plural').dispatchCallback()
      );
  }
}
