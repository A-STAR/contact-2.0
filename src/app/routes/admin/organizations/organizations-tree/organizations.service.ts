import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IOrganizationsActionType, IOrganizationsState } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IOrganizationsState> {
    return this.store
      .select(state => state.organizations)
      .filter(Boolean);
  }

  load(): void {
    this.store.dispatch(this.createAction('ORGANIZATIONS_LOAD'));
  }

  private createAction(type: IOrganizationsActionType, payload?: any): Action {
    return {
      type,
      payload
    };
  }
}
