import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IOrganizationsState } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  static ACTION_FETCH = 'ORGANIZATIONS_FETCH';
  static ACTION_FETCH_SUCCESS = 'ORGANIZATIONS_FETCH_SUCCESS';
  static ACTION_FETCH_ERROR = 'ORGANIZATIONS_FETCH_ERROR';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IOrganizationsState> {
    return this.store
      .select(state => state.organizations)
      .filter(Boolean);
  }

  fetch(): void {
    return this.store.dispatch({
      type: OrganizationsService.ACTION_FETCH
    });
  }
}
