import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IIdentityDoc } from './identity.interface';

import { DataService } from '../../../../core/data/data.service';

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

  create(id: number, doc: IIdentityDoc): Observable<boolean> {
    return this.dataService.create('/persons/{id}/identitydocuments', { id }, doc);
  }

  delete(personId: number, docId: number): Observable<boolean> {
    return this.dataService.delete('/persons/{personId}/identitydocuments/{docId}', { personId, docId });
  }

  update(personId: number, docId: number, doc: IIdentityDoc): Observable<boolean> {
    return this.dataService.update('/persons/{personId}/identitydocuments/{docId}', { personId, docId }, doc);
  }
}
