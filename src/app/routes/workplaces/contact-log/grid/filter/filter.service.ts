import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../../core/data/data.service';

// TODO(d.maltsev): this should live in core/ and (probably) use store (similar to lookups)

@Injectable()
export class FilterService {
  constructor(
    private dataService: DataService,
  ) {}

  fetchUsers(isInactive: boolean = false): Observable<any[]> {
    // TODO(d.maltsev): notifications
    return this.dataService.readAll('/filters/users', {}, { params: { isInactive } });
  }
}
