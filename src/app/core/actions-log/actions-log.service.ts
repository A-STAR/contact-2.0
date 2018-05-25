import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class ActionsLogService {
  constructor(
    private dataService: DataService,
  ) {}

  logOpenAction(duration: number, personId: number): Observable<void> {
    const data = { typeCode: 1, duration, personId };
    return this.dataService.create('/actions', {}, data);
  }
}
