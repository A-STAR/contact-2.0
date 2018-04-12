import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class SelectPropertyService {
  constructor(
    private dataService: DataService,
  ) {}

  readAll(personId: number): Observable<any[]> {
    return this.dataService.readAll('/persons/{personId}/property', { personId }).pipe(
      // TODO(d.maltsev): error handling
    );
  }
}
