import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import { IAppState } from '../../../core/state/state.interface';
import { IUser, IUsersState } from './users.interface';

import { DataService } from '../../../core/data/data.service';

@Injectable()
export class UsersService {
  static USERS_FETCH         = 'USERS_FETCH';
  static USER_FETCH          = 'USER_FETCH';
  static USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
  static USERS_CLEAR         = 'USERS_CLEAR';
  static USER_CREATE         = 'USER_CREATE';
  static USER_UPDATE         = 'USER_UPDATE';
  static USER_UPDATE_PHOTO   = 'USER_UPDATE_PHOTO';
  static USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
  static USER_SELECT         = 'USER_SELECT';
  static USER_TOGGLE_BLOCKED = 'USER_TOGGLE_BLOCKED';

  constructor(
    private dataService: DataService,
    private store: Store<IAppState>,
  ) {}

  get state(): Observable<IUsersState> {
    return this.store
      .select(state => state.users)
      .filter(Boolean);
  }

  fetch(): void {
    return this.store.dispatch({
      type: UsersService.USERS_FETCH
    });
  }

  fetchOne(userId: number): void {
    return this.store.dispatch({
      type: UsersService.USER_FETCH,
      payload: {
        userId
      }
    });
  }

  create(user: IUser, photo: File | false): void {
    return this.store.dispatch({
      type: UsersService.USER_CREATE,
      payload: {
        user,
        photo
      }
    });
  }

  update(user: IUser, photo: File | false, userId: number): void {
    return this.store.dispatch({
      type: UsersService.USER_UPDATE,
      payload: {
        user,
        photo,
        userId,
      }
    });
  }

  clear(): void {
    return this.store.dispatch({
      type: UsersService.USERS_CLEAR
    });
  }

  select(userId: number): void {
    return this.store.dispatch({
      type: UsersService.USER_SELECT,
      payload: {
        userId
      }
    });
  }

  toggleBlockedFilter(): void {
    return this.store.dispatch({
      type: UsersService.USER_TOGGLE_BLOCKED
    });
  }
}
