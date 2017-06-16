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
      return this.createUser(action.payload.user)
        .mergeMap(data => [
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
      const [action, store]: [Action, IAppState] = data;
      return this.updateUser(store.users.selectedUserId, action.payload.user)
        .mergeMap(() => {
          console.log(store.users.photo);
          return [
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

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readUsers(): Observable<any> {
    return this.gridService.read('/api/users');
  }

  private createUser(user: IUser): Observable<any> {
    return this.gridService.create('/api/users', {}, user);
  }

  private updateUser(userId: number, user: IUser): Observable<any> {
    return this.gridService.update('/api/users/{userId}', { userId }, user);
  }

  private createPhoto(userId: number, photo: File): Observable<any> {
    const data = new FormData();
    data.append('file', photo);
    return this.gridService.create('/api/users/{userId}/photo', { userId }, photo);
  }

  private deletePhoto(userId: number): Observable<any> {
    return this.gridService.delete('/api/users/{userId}/photo', { userId });
  }
}
