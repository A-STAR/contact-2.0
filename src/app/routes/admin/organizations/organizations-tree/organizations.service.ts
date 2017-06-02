import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IOrganizationsState } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  static ORGANIZATIONS_FETCH = 'ORGANIZATIONS_FETCH';
  static ORGANIZATIONS_FETCH_SUCCESS = 'ORGANIZATIONS_FETCH_SUCCESS';
  static ORGANIZATIONS_CLEAR = 'ORGANIZATIONS_CLEAR';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IOrganizationsState> {
    return this.store
      .select(state => state.organizations)
      .filter(Boolean);
  }

  fetch(): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_FETCH
    });
  }
}
