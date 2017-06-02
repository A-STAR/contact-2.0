import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IOrganization, IOrganizationsState } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  static ORGANIZATIONS_FETCH = 'ORGANIZATIONS_FETCH';
  static ORGANIZATIONS_FETCH_SUCCESS = 'ORGANIZATIONS_FETCH_SUCCESS';
  static ORGANIZATIONS_CREATE = 'ORGANIZATIONS_CREATE';
  static ORGANIZATIONS_UPDATE = 'ORGANIZATIONS_UPDATE';
  static ORGANIZATIONS_DELETE = 'ORGANIZATIONS_DELETE';
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

  create(parentId: number, organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_CREATE,
      payload: {
        parentId,
        organization
      }
    });
  }

  update(organizationId: number, organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_UPDATE,
      payload: {
        organizationId,
        organization
      }
    });
  }

  delete(organizationId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_DELETE,
      payload: {
        organizationId
      }
    });
  }
}
