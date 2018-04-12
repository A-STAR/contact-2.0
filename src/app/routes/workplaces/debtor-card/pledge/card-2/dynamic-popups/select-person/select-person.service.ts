import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class SelectPersonService {
  constructor(
    private dataService: DataService,
  ) {}

  search(): Observable<any[]> {
    return this.dataService.create('/persons/search', {}, {}).pipe(
      map(response => response.data),
      // TODO(d.maltsev): error handling
    );
  }
}
