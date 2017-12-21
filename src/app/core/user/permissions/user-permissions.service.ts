import { Injectable, OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../state/state.interface';
import { IUserPermissions } from './user-permissions.interface';

import { ValueBag } from '../../value-bag/value-bag';

@Injectable()
export class UserPermissionsService implements OnDestroy {
  static USER_PERMISSIONS_FETCH         = 'USER_PERMISSIONS_FETCH';
  static USER_PERMISSIONS_FETCH_SUCCESS = 'USER_PERMISSIONS_FETCH_SUCCESS';

  private isInitialised = false;
  private permissions: IUserPermissions;
  private permissionsSub: Subscription;

  constructor(private store: Store<IAppState>) {
    this.permissionsSub = this.permissions$.subscribe(permissions => this.permissions = permissions);
  }

  ngOnDestroy(): void {
    this.permissionsSub.unsubscribe();
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

  bag(): Observable<ValueBag> {
    return this.getPermissions()
      .map(permissions => new ValueBag(permissions))
      .distinctUntilChanged();
  }

  check(callback: (permissions: ValueBag) => boolean): Observable<boolean> {
    return this.bag()
      .map(bag => callback(bag))
      .distinctUntilChanged();
  }
  /**
   * Returns true if the permission exists and is set to `true`
   * @param name Permission name
   */
  has(name: string): Observable<boolean> {
    return this.check(bag => bag.has(name));
  }
  /**
   * Returns true if at least one of the permissions exists and is set to `true`
   * @param names Permission names
   */
  hasOne(names: Array<string>): Observable<boolean> {
    return this.check(bag => bag.hasOneOf(names));
  }
  /**
   * Returns true if all of the permissions exist and are set to `true`
   * @param names Permission names
   */
  hasAll(names: Array<string>): Observable<boolean> {
    return this.check(bag => bag.hasAllOf(names));
  }
  /**
   * Returns true if the permission exists and either its value is set to `ALL`,
   * or it contains the `value` passed as a paramater
   * @param name Permission name
   * @param value Permission code value
   */
  contains(name: string, value: number): Observable<boolean> {
    return this.check(bag => bag.contains(name, value));
  }
  /**
   * Returns true if the permission exists and either its value is set to `ALL`,
   * or it contains at least one of the `values` passed as a paramater
   * @param name Permission name
   * @param values Permission code values
   */
  containsOne(name: string, values: Array<number>): Observable<boolean> {
    return this.check(bag => bag.containsOneOf(name, values));
  }
  /**
   * Returns true if the permission exists and either its value is set to `ALL`,
   * or it contains all of the `values` passed as a paramater
   * @param name Permission name
   * @param values Permission code values
   */
  containsAll(name: string, values: Array<number>): Observable<boolean> {
    return this.check(bag => bag.containsAllOf(name, values));
  }
  /**
   * Returns true if the permission exists and if it contains a custom value,
   * that should be greater than `CUSTOM_PERMISSION_THRESHOLD`
   * @param name Permission name
   */
  containsCustom(name: string): Observable<boolean> {
    return this.check(bag => bag.containsCustom(name));
  }

  /**
   * @deprecated
   */
  get(permissionNames: Array<string>): Observable<IUserPermissions> {
    return this.getPermissions()
      .map(permissions => permissionNames.reduce((acc, name) => ({ ...acc, [name]: permissions[name] }), {}))
      .distinctUntilChanged();
  }

  reset(): void {
    this.isInitialised = false;
    this.permissions = null;
  }

  private getPermissions(): Observable<IUserPermissions> {
    if (!this.permissions && !this.isInitialised) {
      this.isInitialised = true;
      this.refresh();
    }

    return this.permissions$
      .filter(Boolean)
      .distinctUntilChanged();
  }

  private get permissions$(): Observable<IUserPermissions> {
    return this.store.select(state => state.userPermissions)
      .filter(Boolean)
      .map(state => state.permissions);
  }
}
