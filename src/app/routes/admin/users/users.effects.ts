import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IUser } from './users.interface';

import { UsersService } from './users.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class UsersEffects {

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
        .catch(() => {
          this.notificationsService.error('users.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createUser$ = this.actions
    .ofType(UsersService.USER_CREATE)
    .switchMap((action: Action) => {
      const { user, photo } = action.payload;
      return this.createUser(user)
        .mergeMap(response => [
          {
            type: UsersService.USER_UPDATE_PHOTO,
            payload: {
              userId: response.id,
              photo
            }
          },
          {
            type: UsersService.USERS_FETCH
          },
          {
            type: UsersService.USER_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => {
          this.notificationsService.error('users.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateUser$ = this.actions
    .ofType(UsersService.USER_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [ action, store ]: [Action, IAppState] = data;
      const { user, photo } = action.payload;
      return this.updateUser(store.users.selectedUserId, user)
        .mergeMap(() => {
          return [
            {
              type: UsersService.USER_UPDATE_PHOTO,
              payload: {
                userId: store.users.selectedUserId,
                photo
              }
            },
            {
              type: UsersService.USERS_FETCH
            },
            {
              type: UsersService.USER_DIALOG_ACTION,
              payload: {
                dialogAction: null
              }
            }
          ];
        })
        .catch(() => {
          this.notificationsService.error('users.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateUserPhoto$ = this.actions
    .ofType(UsersService.USER_UPDATE_PHOTO)
    .switchMap(data => {
      const { userId, photo } = data.payload;
      return this.updatePhoto(userId, photo)
        .mergeMap(() => [])
        .catch(() => {
          // TODO(d.maltsev): i18n
          this.notificationsService.error('Could not save photo');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readUsers(): Observable<any> {
    return this.gridService.read('/users');
  }

  private createUser(user: IUser): Observable<any> {
    return this.gridService.create('/users', {}, user);
  }

  private updateUser(userId: number, user: IUser): Observable<any> {
    return this.gridService.update('/users/{userId}', { userId }, user);
  }

  private updatePhoto(userId: number, photo: File | false): Observable<any> {
    if (!photo) {
      return this.gridService.delete('/users/{userId}/photo', { userId });
    }

    const data = new FormData();
    data.append('file', photo);
    return this.gridService.create('/users/{userId}/photo', { userId }, data);
  }
}
