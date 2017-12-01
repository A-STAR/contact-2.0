import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class FilterGridService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  filter(gridKey: string, filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<any>> {
    return this.dataService.create(`/list?name=${gridKey}`, {}, this.gridService.buildRequest(params, filters))
      .catch(this.notifications.fetchError().entity('entities.filterGrid.gen.plural').dispatchCallback());
  }
}
