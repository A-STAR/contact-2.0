import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserPermission, IUserPermissionsState } from './user-permissions.interface';

@Injectable()
export class UserPermissionsService {
  static USER_PERMISSIONS_FETCH         = 'USER_PERMISSIONS_FETCH';
  static USER_PERMISSIONS_FETCH_SUCCESS = 'USER_PERMISSIONS_FETCH_SUCCESS';
  static USER_PERMISSIONS_FETCH_FAILURE = 'USER_PERMISSIONS_FETCH_FAILURE';

  constructor(private store: Store<IAppState>) {}

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.isResolved);
  }

  createRefreshAction(): Action {
    return {
      type: UserPermissionsService.USER_PERMISSIONS_FETCH
    };
  }

  refresh(): void {
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  // TODO(d.maltsev) methods to check if user has permissions

  private get state(): Observable<IUserPermissionsState> {
    return this.store.select(state => state.userPermissions);
  }
}
