import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class SelectPersonService {
  readonly response$ = new BehaviorSubject<IAGridResponse<any>>(null);

  private _quickFilters: FilterObject;
  private _filters: FilterObject;
  private _params: IAGridRequestParams;

  constructor(
    private dataService: DataService,
    private gridService: GridService,
  ) {}

  set filters(filters: FilterObject) {
    this._filters = filters;
  }

  set quickFilters(quickFilters: FilterObject) {
    this._quickFilters = quickFilters;
  }

  set params(params: IAGridRequestParams) {
    this._params = params;
  }

  onRequest(): void {
    const filters = FilterObject.create().and();
    if (this._filters) {
      filters.addFilter(this._filters);
    }
    if (this._quickFilters) {
      filters.addFilter(this._quickFilters);
    }
    const request = this.gridService.buildRequest(this._params, filters);
    this.dataService
      .create('/list?name=personSearch', {}, request)
      .subscribe((response: IAGridResponse<any>) => this.response$.next(response));
  }
}
