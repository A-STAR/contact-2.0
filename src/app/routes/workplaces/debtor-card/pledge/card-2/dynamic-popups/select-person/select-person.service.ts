import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class SelectPersonService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
  ) {}

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<any>> {
    const request = this.gridService.buildRequest(params, filters);
    // TODO(d.maltsev): error handling
    return this.dataService.create('/list?name=actions', {}, request);
  }
}
