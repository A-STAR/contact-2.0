import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPromise } from './promise.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class PromiseService {
  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, promise: IPromise): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/promise', { debtId, guid }, promise);
  }
}
