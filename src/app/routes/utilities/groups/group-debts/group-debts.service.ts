import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGroupDebt } from './group-debts.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class GroupDebtsService {

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService
  ) { }

  fetch(groupId: number, filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IGroupDebt>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create('/groups/{groupId}/debts', { groupId }, request)
      .catch(this.notificationsService.fetchError().entity('entities.groupDebts.gen.plural').callback());
  }

}
