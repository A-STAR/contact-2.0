import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserConstantsResponse } from './user-constants.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsEffects {
  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserConstantsService.USER_CONSTANTS_FETCH)
    .mergeMap((action: Action) => {
      return this.read()
        .map((response: IUserConstantsResponse) => ({
          type: UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS,
          payload: {
            data: response.data
          }
        }))
        .catch(this.notificationService.error('errors.default.read').entity('entities.user.constants.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserConstantsResponse> {
    return this.dataService.read('/constants/values');
  }
}
