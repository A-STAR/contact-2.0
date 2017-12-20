import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IUserConstant } from './user-constants.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsEffects {
  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserConstantsService.USER_CONSTANTS_FETCH)
    .mergeMap((action: UnsafeAction) => {
      return this.read()
        .map((constants: IUserConstant[]) => ({
          type: UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS,
          payload: {
            data: constants
          }
        }))
        .catch(this.notificationService.fetchError().entity('entities.user.constants.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserConstant[]> {
    return this.dataService.readAll('/constants/values');
  }
}
