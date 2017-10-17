import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IUser } from './users.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersEffects {

  @Effect()
  fetchUser$ = this.actions
    .ofType(UsersService.USER_FETCH)
    .switchMap((action: Action) => {
      return this.readUser(action.payload.userId)
        .map(user => ({
          type: UsersService.USER_FETCH_SUCCESS,
          payload: { user }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.singular').callback());
    });

  @Effect()
  createUser$ = this.actions
    .ofType(UsersService.USER_CREATE)
    .switchMap((action: Action) => {
      const { user, photo } = action.payload;
      return this.createUser(user)
        .mergeMap(response => {
          const actions = [
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
        .catch(this.notificationsService.error('errors.default.create').entity('entities.users.gen.singular').callback());
    });

  @Effect()
  updateUser$ = this.actions
    .ofType(UsersService.USER_UPDATE)
    .switchMap((action: Action) => {
      const { user, photo, userId } = action.payload;
      return this.updateUser(userId, user)
        .mergeMap(() => {
          const actions = [
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
        .catch(this.notificationsService.error('errors.default.update').entity('entities.users.gen.singular').callback());
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
          const message = photo ? 'errors.default.upload' : 'errors.default.delete';
          return [
            this.notificationsService.error(message).entity('entities.users.photos.gen.singular').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

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
