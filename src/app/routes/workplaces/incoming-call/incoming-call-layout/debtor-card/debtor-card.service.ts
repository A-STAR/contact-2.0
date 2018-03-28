import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class DebtorCardService {
  constructor(
    private dataService: DataService,
  ) { }

  fetch(debtId: number): Observable<any[]> {
    // TODO(d.maltsev): notifications
    return this.dataService.read('/debts/{debtId}/incomingCall/info', { debtId });
  }
}
