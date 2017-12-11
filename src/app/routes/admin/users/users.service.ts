import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/filter';

import { DataService } from '../../../core/data/data.service';
import { IAppState } from '../../../core/state/state.interface';
import { IUser, IUsersState } from './users.interface';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class UsersService {
  static USER_SELECT          = 'USER_SELECT';
  static USER_TOGGLE_INACTIVE = 'USER_TOGGLE_INACTIVE';
  static USER_SAVED           = 'USER_SAVED';

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private store: Store<IAppState>,
    private notificationsService: NotificationsService,
  ) {}

  get state(): Observable<IUsersState> {
    return this.store.select(state => state.users);
  }

  fetch(): Observable<Array<IUser>> {
    return this.dataService
      .readAll('/users')
      .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.plural').dispatchCallback());
  }

  fetchOne(id: string): Observable<IUser> {
    return this.dataService.read('/users/{id}', { id })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.singular').dispatchCallback());
  }

  create(user: IUser, photo: File | false): Observable<any> {
    return this.createUser(user).concatMap(
      () => !photo && photo !== false ? Observable.of(null) : this.updatePhoto(String(user.id), photo)
    );
  }

  update(user: IUser, photo: File | false, userId: string): Observable<any> {
    return this.updateUser(userId, user).concatMap(
      () => !photo && photo !== false ? Observable.of(null) : this.updatePhoto(userId, photo)
    );
  }

  select(userId: string): void {
    this.dispatchAction(UsersService.USER_SELECT, { userId });
  }

  createUser(user: IUser): Observable<any> {
    return this.dataService.create('/users', {}, user)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.users.gen.singular').dispatchCallback());
  }

  updateUser(userId: string, user: IUser): Observable<any> {
    return this.dataService.update('/users/{userId}', { userId }, user)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.users.gen.singular').dispatchCallback());
  }

  createPhoto(userId: string, photo: File): Observable<any> {
    return this.dataService.createMultipart('/users/{userId}/photo', { userId }, null, photo)
      .catch(this.notificationsService
        .error('errors.default.upload')
        .entity('entities.users.photos.gen.singular')
        .dispatchCallback()
      );
  }

  deletePhoto(userId: string): Observable<any> {
    return this.dataService.delete('/users/{userId}/photo', { userId })
      .catch(this.notificationsService
        .error('errors.default.delete')
        .entity('entities.users.photos.gen.singular')
        .dispatchCallback()
      );
  }

  toggleInactiveFilter(): void {
    this.dispatchAction(UsersService.USER_TOGGLE_INACTIVE);
  }

  dispatchAction(type: string, payload: object = {}): void {
    return this.store.dispatch({ type, payload });
  }

  getAction(action: string): Actions<any> {
    return this.actions.ofType(action);
  }

  private updatePhoto(userId: string, photo: File | false): Observable<any> {
    return photo === false ? this.deletePhoto(userId) : this.createPhoto(userId, photo);
  }
}
