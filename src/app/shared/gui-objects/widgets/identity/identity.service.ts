import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IIdentityDoc } from './identity.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class IdentityService {
  static GRID_IDENTITY_FETCH = 'DEBTOR_IDENTITY_FETCH';
  static GRID_IDENTITY_FETCH_SUCCESS = 'DEBTOR_IDENTITY_FETCH_SUCCESS';
  static MESSAGE_IDENTITY_SAVED = 'MESSAGE_IDENTITY_SAVED';

  hasMain = false;
  private url = '/persons/{personId}/identitydocuments';

  constructor(
    private dataService: DataService,
  ) {}

  fetchAll(personId: number): Observable<any> {
    return this.dataService.read('/persons/{personId}/identitydocuments', { personId })
      .map(response => response.identityDocuments)
      .do(identityDocs => this.checkForMain(identityDocs));
  }

  fetch(personId: number, docId: number): Observable<IIdentityDoc> {
    return this.dataService.read(`${this.url}/{docId}`, { personId, docId })
      .map(response => response.identityDocuments)
      .map(identity => identity[0] || {});
  }

  create(personId: number, doc: IIdentityDoc): Observable<boolean> {
    return this.dataService.create(this.url, { personId }, doc);
  }

  delete(personId: number, docId: number): Observable<boolean> {
    return this.dataService.delete(`${this.url}/{docId}`, { personId, docId });
  }

  update(personId: number, docId: number, doc: IIdentityDoc): Observable<boolean> {
    return this.dataService.update(`${this.url}/{docId}`, { personId, docId }, doc);
  }

  private checkForMain(identityDocs: IIdentityDoc[]): void {
    this.hasMain = identityDocs.some(doc => Boolean(doc.isMain));
  }
}
