import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../state/state.interface';
import { IUserPermission, IUserPermissions } from './user-permissions.interface';

@Injectable()
export class UserPermissionsService {
  static USER_PERMISSIONS_FETCH         = 'USER_PERMISSIONS_FETCH';
  static USER_PERMISSIONS_FETCH_SUCCESS = 'USER_PERMISSIONS_FETCH_SUCCESS';

  private permissions: IUserPermissions;
  private isInitialized = false;

  constructor(private store: Store<IAppState>) {
    this.permissions$.subscribe(permissions => this.permissions = permissions);
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

  get(permissionNames: Array<string>): Observable<IUserPermissions> {
    return this.getPermissions()
      .map(permissions => permissionNames.reduce((acc, name) => ({ ...acc, [name]: permissions[name] }), {}))
      .distinctUntilChanged();
  }

  has(permissionName: string): Observable<boolean> {
    return this.getPermissions().map(permissions => this.userHasPermission(permissions, permissionName)).distinctUntilChanged();
  }

  hasOne(permissionNames: Array<string>): Observable<boolean> {
    return this.getPermissions().map(permissions =>
      permissionNames.reduce((acc, permissionName) => acc || this.userHasPermission(permissions, permissionName), false)
    ).distinctUntilChanged();
  }

  hasAll(permissionNames: Array<string>): Observable<boolean> {
    return this.getPermissions().map(permissions =>
      permissionNames.reduce((acc, permissionName) => acc && this.userHasPermission(permissions, permissionName), true)
    ).distinctUntilChanged();
  }

  private userHasPermission(permissions: IUserPermissions, permissionName: string): boolean {
    const permission = permissions[permissionName];
    return permission && permission.valueB;
  }

  private getPermissions(): Observable<IUserPermissions> {
    if (!this.permissions && !this.isInitialized) {
      this.isInitialized = true;
      this.refresh();
    }

    return this.permissions$
      .filter(Boolean)
      .distinctUntilChanged();
  }

  private get permissions$(): Observable<IUserPermissions> {
    return this.store.select(state => state.userPermissions.permissions);
  }
}
