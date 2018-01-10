import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class PersonSelectService {

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<any>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService.create('/persons/search', {}, request)
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.plural').dispatchCallback());
  }
}
