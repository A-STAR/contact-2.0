import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAppState } from '@app/core/state/state.interface';
import { IUserPermissions } from './user-permissions.interface';

import { AuthService } from '@app/core/auth/auth.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

@Injectable()
export class UserPermissionsService {
  static USER_PERMISSIONS_FETCH         = 'USER_PERMISSIONS_FETCH';
  static USER_PERMISSIONS_FETCH_SUCCESS = 'USER_PERMISSIONS_FETCH_SUCCESS';

  private permissions$ = combineLatest(
    this.authService.currentUser$.map(user => user && user.userId),
    this.store.select(state => state.userPermissions.permissions)
  )
  .pipe(
    tap(([userId, permissions]) => {
      if (permissions) {
        this.isFetching = false;
      } else if (!this.isFetching && userId) {
        this.refresh();
      }
    }),
    map(([userId, permissions]) => permissions),
    filter(Boolean),
    distinctUntilChanged(),
  );

  private bag$ = this.permissions$.pipe(
    map(permissions => new ValueBag(permissions)),
    distinctUntilChanged(),
  );

  private isFetching = false;

  constructor(
    private authService: AuthService,
    private store: Store<IAppState>
  ) {}

  createRefreshAction(): Action {
    return {
      type: UserPermissionsService.USER_PERMISSIONS_FETCH
    };
  }

  refresh(): void {
    this.isFetching = true;
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  bag(): Observable<ValueBag> {
    return this.bag$;
  }

  check(callback: (permissions: ValueBag) => boolean): Observable<boolean> {
    return this.bag().pipe(
      map(bag => callback(bag)),
      distinctUntilChanged(),
    );
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
    return this.permissions$.pipe(
      map(permissions => permissionNames.reduce((acc, name) => ({ ...acc, [name]: permissions[name] }), {})),
      distinctUntilChanged(),
    );
  }
}
