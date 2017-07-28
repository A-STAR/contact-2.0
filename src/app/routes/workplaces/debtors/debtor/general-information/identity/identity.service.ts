import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../../../core/data/data.service';

@Injectable()
export class IdentityService {
  static GRID_IDENTITY_FETCH = 'DEBTOR_IDENTITY_FETCH';
  static GRID_IDENTITY_FETCH_SUCCESS = 'DEBTOR_IDENTITY_FETCH_SUCCESS';

  constructor(
    private dataService: DataService,
  ) {}

  fetch(id: number): Observable<any> {
    return this.dataService.read('/persons/{id}/identitydocuments', { id })
      .map(response => response.identityDocuments);
  }
}
