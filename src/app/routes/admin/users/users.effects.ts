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

  private fetchAction = {
    type: UsersService.USERS_FETCH
  };

  private closeDialogAction = {
    type: UsersService.USER_DIALOG_ACTION,
    payload: {
      dialogAction: null
    }
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
        .catch(() => {
          return [
            this.notificationsService.createErrorAction('users.messages.errors.fetch')
          ];
        });
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
            this.closeDialogAction
          ];
          return !photo && photo !== false ? actions : [{
            type: UsersService.USER_UPDATE_PHOTO,
            payload: {
              userId: response.id,
              photo
            }
          }, ...actions];
        })
        .catch(() => {
          return [
            this.notificationsService.createErrorAction('users.messages.errors.create')
          ];
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
          const actions = [
            this.fetchAction,
            this.closeDialogAction
          ];
          return !photo && photo !== false ? actions : [{
            type: UsersService.USER_UPDATE_PHOTO,
            payload: {
              userId: store.users.selectedUserId,
              photo
            }
          }, ...actions];
        })
        .catch(() => {
          return [
            this.notificationsService.createErrorAction('users.messages.errors.update')
          ];
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
          const message = photo ? 'users.messages.errors.updatePhoto' : 'users.messages.errors.deletePhoto';
          return [
            this.notificationsService.createErrorAction(message)
          ];
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
    if (photo === false) {
      return this.gridService.delete('/users/{userId}/photo', { userId });
    }

    const data = new FormData();
    data.append('file', photo);
    return this.gridService.create('/users/{userId}/photo', { userId }, data);
  }
}
