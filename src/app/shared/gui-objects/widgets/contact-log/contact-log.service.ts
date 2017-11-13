import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../components/grid2/grid2.interface';

import { IContact } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../components/grid2/filter/grid-filter';

@Injectable()
export class ContactLogService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(
    personId: number,
    filters: FilterObject,
    params: IAGridRequestParams,
  ): Observable<IAGridResponse<IContact>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService
      .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, request)
      .catch(this.notificationsService.fetchError().entity(`entities.contacts.gen.plural`).dispatchCallback());
  }
}
