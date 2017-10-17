import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { DataService } from '../../../core/data/data.service';
import { IAppState } from '../../../core/state/state.interface';
import { IUser, IUsersState } from './users.interface';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class UsersService {
  static USER_FETCH           = 'USER_FETCH';
  static USER_FETCH_SUCCESS   = 'USER_FETCH_SUCCESS';
  static USER_CREATE          = 'USER_CREATE';
  static USER_UPDATE          = 'USER_UPDATE';
  static USER_UPDATE_PHOTO    = 'USER_UPDATE_PHOTO';
  static USER_UPDATE_SUCCESS  = 'USER_UPDATE_SUCCESS';
  static USER_SELECT          = 'USER_SELECT';
  static USER_TOGGLE_INACTIVE = 'USER_TOGGLE_INACTIVE';

  constructor(
    private dataService: DataService,
    private store: Store<IAppState>,
    private notificationsService: NotificationsService,
  ) {}

  get state(): Observable<IUsersState> {
    return this.store
      .select(state => state.users)
      .filter(Boolean);
  }

  fetch(): Observable<Array<IUser>> {
    return this.dataService
      .readAll('/users')
      .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.plural').dispatchCallback());
  }

  fetchOne(userId: number): void {
    this.dispatchAction(UsersService.USER_FETCH, { userId });
  }

  create(user: IUser, photo: File | false): void {
    this.dispatchAction(UsersService.USER_CREATE, { user, photo });
  }

  update(user: IUser, photo: File | false, userId: number): void {
    this.dispatchAction(UsersService.USER_UPDATE, { user, photo, userId });
  }

  select(userId: number): void {
    this.dispatchAction(UsersService.USER_SELECT, { userId });
  }

  toggleInactiveFilter(): void {
    this.dispatchAction(UsersService.USER_TOGGLE_INACTIVE);
  }

  private dispatchAction(type: string, payload: object = {}): void {
    return this.store.dispatch({ type, payload });
  }
}
