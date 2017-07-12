import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IUser } from './users.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersEffects {

  private fetchAction = {
    type: UsersService.USERS_FETCH
  };

  @Effect()
  fetchUsers$ = this.actions
    .ofType(UsersService.USERS_FETCH)
    .switchMap((action: Action) => {
      return this.readUsers()
        .mergeMap(data => [
          {
            type: UsersService.USERS_FETCH_SUCCESS,
            payload: {
              users: data.users
            }
          },
          {
            type: UsersService.USER_SELECT,
            payload: {
              userId: null
            }
          }
        ])
        .catch(() => [
          this.notificationsService.createErrorAction('users.messages.errors.fetch')
        ]);
    });

  @Effect()
  fetchUser$ = this.actions
    .ofType(UsersService.USER_FETCH)
    .switchMap((action: Action) => {
      return this.readUser(action.payload.userId)
        .map(response => ({
          type: UsersService.USER_FETCH_SUCCESS,
          payload: {
            user: response.users[0]
          }
        }))
        .catch(() => [
          this.notificationsService.createErrorAction('users.messages.errors.fetch')
        ]);
    });

  @Effect()
  createUser$ = this.actions
    .ofType(UsersService.USER_CREATE)
    .switchMap((action: Action) => {
      const { user, photo } = action.payload;
      return this.createUser(user)
        .mergeMap(response => {
          const actions = [
            this.fetchAction,
            {
              type: UsersService.USER_UPDATE_SUCCESS
            }
          ];
          return !photo && photo !== false ? actions : [{
            type: UsersService.USER_UPDATE_PHOTO,
            payload: {
              userId: response.id,
              photo
            }
          }, ...actions];
        })
        .catch(() => [
          this.notificationsService.createErrorAction('users.messages.errors.create')
        ]);
    });

  @Effect()
  updateUser$ = this.actions
    .ofType(UsersService.USER_UPDATE)
    .switchMap((action: Action) => {
      const { user, photo, userId } = action.payload;
      return this.updateUser(userId, user)
        .mergeMap(() => {
          const actions = [
            this.fetchAction,
            {
              type: UsersService.USER_UPDATE_SUCCESS
            }
          ];
          return !photo && photo !== false ? actions : [{
            type: UsersService.USER_UPDATE_PHOTO,
            payload: {
              userId,
              photo
            }
          }, ...actions];
        })
        .catch(() => [
          this.notificationsService.createErrorAction('users.messages.errors.update')
        ]);
    });

  @Effect()
  updateUserPhoto$ = this.actions
    .ofType(UsersService.USER_UPDATE_PHOTO)
    .switchMap(data => {
      const { userId, photo } = data.payload;
      return this.updatePhoto(userId, photo)
        .mergeMap(() => [
          {
            type: UsersService.USER_UPDATE_SUCCESS
          }
        ])
        .catch(error => {
          const message = photo ?
            error.status === 413 ? 'users.messages.errors.updatePhotoMaxSizeExceeded' : 'users.messages.errors.updatePhoto' :
            'users.messages.errors.deletePhoto';
          return [
            this.notificationsService.createErrorAction(message)
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readUsers(): Observable<any> {
    return this.dataService.read('/users');
  }

  private readUser(id: number): Observable<any> {
    return this.dataService.read('/users/{id}', { id });
  }

  private createUser(user: IUser): Observable<any> {
    return this.dataService.create('/users', {}, user);
  }

  private updateUser(userId: number, user: IUser): Observable<any> {
    return this.dataService.update('/users/{userId}', { userId }, user);
  }

  private updatePhoto(userId: number, photo: File | false): Observable<any> {
    if (photo === false) {
      return this.dataService.delete('/users/{userId}/photo', { userId });
    }

    const data = new FormData();
    data.append('file', photo);
    return this.dataService.create('/users/{userId}/photo', { userId }, data);
  }
}
