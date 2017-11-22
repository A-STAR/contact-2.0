import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';
import { IPayment } from './payments.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class PaymentsService {

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(params: IAGridRequestParams, filters?: FilterObject | Object, ): Observable<IAGridResponse<IPayment>> {
    const request = this.gridService.buildRequest(params, filters as FilterObject);
    return this.dataService.create(`/list?name=payments`, {}, request)
      .catch(this.notifications.fetchError().entity('entities.payments.gen.plural').dispatchCallback());
  }

}
