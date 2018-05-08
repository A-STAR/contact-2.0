import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '@app/core/state/state.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IUser, IUsersState } from './users.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class UsersService extends AbstractActionService {
  static USER_SELECT          = 'USER_SELECT';
  static USER_TOGGLE_INACTIVE = 'USER_TOGGLE_INACTIVE';
  static USER_SAVED           = 'USER_SAVED';

  readonly state: Observable<IUsersState> = this.store.select(state => state.users);
  readonly agentAttributes$: Observable<IEntityAttributes> = this.entityAttributesService.getAttributes([87, 88, 89]);

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private entityAttributesService: EntityAttributesService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetch(): Observable<Array<IUser>> {
    return this.dataService
      .readAll('/users')
      .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.plural').dispatchCallback());
  }

  fetchOne(id: number): Observable<IUser> {
    return this.dataService.read('/users/{id}', { id })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.users.gen.singular').dispatchCallback());
  }

  create(user: IUser, photo: File | false): Observable<any> {
    return this.createUser(user).concatMap(
      () => !photo && photo !== false ? of(null) : this.updatePhoto(user.id, photo)
    );
  }

  update(user: IUser, photo: File | false, userId: number): Observable<any> {
    return this.updateUser(userId, user).concatMap(
      () => !photo && photo !== false ? of(null) : this.updatePhoto(userId, photo)
    );
  }

  select(userId: number): void {
    this.dispatchAction(UsersService.USER_SELECT, { userId });
  }

  createUser(user: IUser): Observable<any> {
    return this.dataService.create('/users', {}, user)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.users.gen.singular').dispatchCallback());
  }

  updateUser(userId: number, user: IUser): Observable<any> {
    return this.dataService.update('/users/{userId}', { userId }, user)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.users.gen.singular').dispatchCallback());
  }

  createPhoto(userId: number, photo: File): Observable<any> {
    return this.dataService.createMultipart('/users/{userId}/photo', { userId }, null, photo)
      .catch(this.notificationsService
        .error('errors.default.upload')
        .entity('entities.users.photos.gen.singular')
        .dispatchCallback()
      );
  }

  deletePhoto(userId: number): Observable<any> {
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

  private updatePhoto(userId: number, photo: File | false): Observable<any> {
    return photo === false ? this.deletePhoto(userId) : this.createPhoto(userId, photo);
  }
}
