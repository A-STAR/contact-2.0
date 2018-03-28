import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IQueryParams } from '@app/core/data/data.interface';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class DebtorGridService {
  constructor(
    private dataService: DataService,
  ) { }

  fetchAll(queryParams: IQueryParams): Observable<any[]> {
    // TODO(d.maltsev): notifications
    return this.dataService.readAll('/incomingCall/search', {}, { params: this.filterOutFalsyParams(queryParams) });
  }

  private filterOutFalsyParams(value: IQueryParams): IQueryParams {
    return Object.keys(value).reduce((acc, key) => {
      const item = value[key];
      return (Array.isArray(item) && item.length === 0 || !item)
        ? acc
        : { ...acc, [key]: item };
    }, {});
  }
}
