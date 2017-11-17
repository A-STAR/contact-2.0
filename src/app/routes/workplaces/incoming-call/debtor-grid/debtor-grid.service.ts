import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IQueryParams } from '../../../../core/data/data.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class DebtorGridService {
  constructor(
    private dataService: DataService,
  ) { }

  fetchAll(params: IQueryParams): Observable<any[]> {
    // TODO(d.maltsev): notifications
    return this.dataService.readAll('/incomingCall/search', {}, { params });
  }
}
