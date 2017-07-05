import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IUser, IUsersState, IUserDialogActionEnum } from './users.interface';

@Injectable()
export class UsersService {
  static USERS_FETCH         = 'USERS_FETCH';
  static USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
  static USERS_CLEAR         = 'USERS_CLEAR';
  static USER_CREATE         = 'USER_CREATE';
  static USER_UPDATE         = 'USER_UPDATE';
  static USER_UPDATE_PHOTO   = 'USER_UPDATE_PHOTO';
  static USER_SELECT         = 'USER_SELECT';
  static USER_DIALOG_ACTION  = 'USER_DIALOG_ACTION';
  static USER_TOGGLE_BLOCKED = 'USER_TOGGLE_BLOCKED';

  constructor(private store: Store<IAppState>) {}

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

  create(user: IUser, photo: File | false): void {
    return this.store.dispatch({
      type: UsersService.USER_CREATE,
      payload: {
        user,
        photo
      }
    });
  }

  update(user: IUser, photo: File | false): void {
    return this.store.dispatch({
      type: UsersService.USER_UPDATE,
      payload: {
        user,
        photo
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

  setDialogAction(dialogAction: IUserDialogActionEnum, userId?: number): void {
    return this.store.dispatch({
      type: UsersService.USER_DIALOG_ACTION,
      payload: {
        dialogAction,
        userId
      }
    });
  }

  setDialogAddAction(): void {
    this.setDialogAction(IUserDialogActionEnum.USER_ADD);
  }

  setDialogEditAction(): void {
    this.setDialogAction(IUserDialogActionEnum.USER_EDIT);
  }

  toggleBlockedFilter(): void {
    return this.store.dispatch({
      type: UsersService.USER_TOGGLE_BLOCKED
    });
  }
}
