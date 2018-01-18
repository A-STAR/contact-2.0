import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ContactSelectService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(guid: string, debtId: number, excludePersonId: number): Observable<any[]> {
    const url = '/regContact/debts/{debtId}/contactPersons';
    const params = excludePersonId ? { excludePersonId } : {};
    return this.dataService
      .readAll(url, { guid, debtId }, { params })
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.plural').dispatchCallback());
  }

  fetchAllPersons(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<any>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService.create('/persons/search', {}, request)
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.plural').dispatchCallback());
  }
}
