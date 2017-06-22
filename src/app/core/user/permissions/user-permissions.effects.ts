import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserPermissionsResponse } from './user-permissions.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserPermissionsService } from './user-permissions.service';

@Injectable()
export class UserPermissionsEffects {
  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserPermissionsService.USER_PERMISSIONS_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map((response: IUserPermissionsResponse) => {
          return {
            type: UserPermissionsService.USER_PERMISSIONS_FETCH_SUCCESS,
            payload: {
              data: response.userPermits.reduce((acc, permission) => {
                acc[permission.name] = permission;
                return acc;
              }, {})
            }
          };
        })
        .catch(() => {
          return [
            {
              type: UserPermissionsService.USER_PERMISSIONS_FETCH_FAILURE
            },
            this.notificationService.createErrorAction('user.permissions.errors.fetch')
          ];
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserPermissionsResponse> {
    return this.gridService.read('/userpermits');
  }
}
