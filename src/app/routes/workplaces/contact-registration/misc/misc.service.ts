import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IMiscData } from './misc.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class MiscService {
  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, data: IMiscData): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .update('/debts/{debtId}/contactRequest/{guid}', { debtId, guid }, data);
  }
}
