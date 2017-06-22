import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserConstantsResponse } from './user-constants.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsEffects {
  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserConstantsService.USER_CONSTANTS_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map((response: IUserConstantsResponse) => {
          return {
            type: UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS,
            payload: {
              data: response.data
            }
          };
        })
        .catch(() => {
          return [
            {
              type: UserConstantsService.USER_CONSTANTS_FETCH_FAILURE
            },
            this.notificationService.createErrorAction('user.constants.errors.fetch')
          ];
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserConstantsResponse> {
    return this.gridService.read('/constants/values');
  }
}
