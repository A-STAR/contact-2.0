import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone } from './phone.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class PhoneService {
  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, phone: IPhone): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/phone', { debtId, guid }, phone);
  }
}
