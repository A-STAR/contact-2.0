import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserPermissionsState } from './user-permissions.interface';

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

  has(permissionName: string): Observable<boolean> {
    return this.state.map(state => this.userHasPermission(state, permissionName));
  }

  hasOne(permissionNames: Array<string>): Observable<boolean> {
    return this.state.map(state =>
      permissionNames.reduce((acc, permissionName) => acc || this.userHasPermission(state, permissionName), false)
    );
  }

  hasAll(permissionNames: Array<string>): Observable<boolean> {
    return this.state.map(state =>
      permissionNames.reduce((acc, permissionName) => acc && this.userHasPermission(state, permissionName), true)
    );
  }

  private userHasPermission(state: IUserPermissionsState, permissionName: string): boolean {
    const permission = state.permissions[permissionName];
    return permission && permission.valueB;
  }

  private get state(): Observable<IUserPermissionsState> {
    return this.store.select(state => state.userPermissions);
  }
}
