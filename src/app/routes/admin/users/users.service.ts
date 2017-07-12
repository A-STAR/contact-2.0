import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { IAppState } from '../../../core/state/state.interface';
import { ILdapGroup, IUser, IUsersState } from './users.interface';

import { DataService } from '../../../core/data/data.service';

@Injectable()
export class UsersService {
  static USERS_FETCH                    = 'USERS_FETCH';
  static USERS_FETCH_SUCCESS            = 'USERS_FETCH_SUCCESS';
  static USER_FETCH                     = 'USER_FETCH';
  static USER_FETCH_SUCCESS             = 'USER_FETCH_SUCCESS';
  static USER_FETCH_LDAP_GROUPS         = 'USER_FETCH_LDAP_GROUPS';
  static USER_FETCH_LDAP_GROUPS_SUCCESS = 'USER_FETCH_LDAP_GROUPS_SUCCESS';
  static USERS_CLEAR                    = 'USERS_CLEAR';
  static USER_CREATE                    = 'USER_CREATE';
  static USER_UPDATE                    = 'USER_UPDATE';
  static USER_UPDATE_PHOTO              = 'USER_UPDATE_PHOTO';
  static USER_UPDATE_SUCCESS            = 'USER_UPDATE_SUCCESS';
  static USER_SELECT                    = 'USER_SELECT';
  static USER_TOGGLE_BLOCKED            = 'USER_TOGGLE_BLOCKED';

  constructor(
    private dataService: DataService,
    private store: Store<IAppState>,
  ) {}

  get state(): Observable<IUsersState> {
    return this.store
      .select(state => state.users)
      .filter(Boolean);
  }

  get ldapGroups$(): Observable<Array<ILdapGroup>> {
    return this.state.map(state => state.ldapGroups)
      .distinctUntilChanged();
  }

  fetch(): void {
    this.dispatchAction(UsersService.USERS_FETCH);
  }

  fetchOne(userId: number): void {
    this.dispatchAction(UsersService.USER_FETCH, { userId });
  }

  fetchLdapGroups(): void {
    this.dispatchAction(UsersService.USER_FETCH_LDAP_GROUPS);
  }

  create(user: IUser, photo: File | false): void {
    this.dispatchAction(UsersService.USER_CREATE, { user, photo });
  }

  update(user: IUser, photo: File | false, userId: number): void {
    this.dispatchAction(UsersService.USER_UPDATE, { user, photo, userId });
  }

  clear(): void {
    this.dispatchAction(UsersService.USERS_CLEAR);
  }

  select(userId: number): void {
    this.dispatchAction(UsersService.USER_SELECT, { userId });
  }

  toggleBlockedFilter(): void {
    this.dispatchAction(UsersService.USER_TOGGLE_BLOCKED);
  }

  private dispatchAction(type: string, payload: object = {}): void {
    return this.store.dispatch({
      type,
      payload
    });
  }
}
