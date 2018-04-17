import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { FilterObject, FilterOperatorType } from '@app/shared/components/grid2/filter/grid-filter';

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

  set params(params: IAGridRequestParams) {
    this._params = params;
  }

  set filtersFormData(formData: any) {
    if (formData) {
      const filters = FilterObject.create().and();
      Object.keys(formData).forEach(prop => {
        const value = formData[prop];
        if (value) {
          const operator: FilterOperatorType = /^\%.+\%$/.test(value)
            ? 'LIKE'
            : '==';
          const filter = FilterObject
            .create()
            .setOperator(operator)
            .setName(prop)
            .setValues(value);
          filters.addFilter(filter);
        }
      });
      this._quickFilters = filters;
    } else {
      this._quickFilters = null;
    }
  }

  search(): void {
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
