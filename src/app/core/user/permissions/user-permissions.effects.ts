import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IUserPermission } from './user-permissions.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserPermissionsService } from './user-permissions.service';

@Injectable()
export class UserPermissionsEffects {
  @Effect()
  fetchUserPermissions$ = this.actions
    .ofType(UserPermissionsService.USER_PERMISSIONS_FETCH)
    .pipe(
      switchMap((action: UnsafeAction) => {
        return this.read().pipe(
          map((permissions: IUserPermission[]) => ({
            type: UserPermissionsService.USER_PERMISSIONS_FETCH_SUCCESS,
            payload: {
              data: permissions.reduce((acc, permission) => ({ ...acc, [permission.name]: permission }), {})
            }
          })),
          catchError(this.notificationService.fetchError().entity('entities.user.permissions.gen.plural').callback()),
        );
      })
    );

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserPermission[]> {
    return this.dataService.readAll('/userpermits');
  }
}
