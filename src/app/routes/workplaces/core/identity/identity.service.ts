import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IIdentityDoc } from './identity.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';

@Injectable()
export class IdentityService extends AbstractActionService {
  static DEBTOR_IDENTITY_SAVED = 'DEBTOR_IDENTITY_SAVED';

  hasMain = false;
  private url = '/persons/{personId}/identitydocuments';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(personId: number): Observable<any> {
    return this.dataService.readAll('/persons/{personId}/identitydocuments', { personId })
      .do(identityDocs => this.checkForMain(identityDocs));
  }

  fetch(personId: number, docId: number): Observable<IIdentityDoc> {
    return this.dataService.read(`${this.url}/{docId}`, { personId, docId });
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
