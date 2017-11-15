import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class DebtorGridService {
  constructor(
    private dataService: DataService,
  ) { }

  fetchAll(params: object): Observable<any[]> {
    // TODO(d.maltsev): notifications
    const httpParams = Object.keys(params)
      .reduce((acc, key) => params[key] ? acc.set(key, params[key]) : acc, new HttpParams());
    return this.dataService.readAll('/incomingCall/search', {}, { params: httpParams });
  }
}
