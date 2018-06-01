import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridResponse, IAGridRequestParams } from '@app/shared/components/grid2/grid2.interface';
import { IGenesysCampaign } from '@app/routes/utilities/campaigns/genesys/genesys.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class GenesysService {

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IGenesysCampaign>> {
    const request = this.gridService.buildRequest(params, filters);
    return this.dataService
      .create(`/list?name=pbxCampaigns`, {}, request)
      .pipe(
        catchError(this.notifications.fetchError().entity('entities.campaign.gen.plural').dispatchCallback()),
      );
  }
}
